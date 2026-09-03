import type { Context, Next } from 'hono'
import { db } from '../db/client.js'
import { rateLimits } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'
import { env } from '../config/env.js'
import type { ApiResponse } from '../types/index.js'

// DB-backed rate limiter middleware.
// Uses the rate_limits table to track request counts per identifier + endpoint.
export const rateLimit = async (c: Context, next: Next) => {
  const isAnon = c.get('isAnonymous') === true
  const user = c.get('user')

  // Use user ID for authenticated requests, IP address for anonymous ones.
  // Prefer x-forwarded-for when running behind a reverse proxy (e.g. Nginx).
  const ip = c.req.header('x-forwarded-for') || '127.0.0.1'
  const identifier = (!isAnon && user) ? user.id : ip

  const endpoint = c.req.path
  const limit = isAnon ? env.rateLimit.anonChatLimit : env.rateLimit.authChatLimit
  const windowMs = env.rateLimit.windowMs

  const now = new Date()

  const [record] = await db
    .select()
    .from(rateLimits)
    .where(and(eq(rateLimits.identifier, identifier), eq(rateLimits.endpoint, endpoint)))
    .limit(1)

  if (!record) {
    // First request in this window — create a new record.
    await db.insert(rateLimits).values({
      identifier,
      endpoint,
      count: 1,
      windowStart: now,
      expiresAt: new Date(now.getTime() + windowMs),
    })
    return await next()
  }

  if (now > record.expiresAt) {
    // Window has expired — reset the counter.
    await db.update(rateLimits).set({
      count: 1,
      windowStart: now,
      expiresAt: new Date(now.getTime() + windowMs),
    })
    return await next()
  }

  if (record.count >= limit) {
    // Limit reached — reject the request.
    const errorResponse: ApiResponse = {
      success: false,
      error: { code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded' },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId') || crypto.randomUUID(),
      },
    }
    return c.json(errorResponse, 429)
  }

  // Increment the counter and continue.
  await db
    .update(rateLimits)
    .set({ count: record.count + 1 })
    .where(eq(rateLimits.id, record.id))

  return await next()
}
