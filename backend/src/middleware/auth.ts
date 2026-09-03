import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { verifyAccessToken } from '../lib/jwt.js'
import { db } from '../db/client.js'
import { users } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import type { HonoEnv, ApiResponse } from '../types/index.js'

/**
 * Parses JWT from context (cookie or Authorization header)
 * Checks DB if user is valid/active. Populates context.
 */
export const authenticate = async (c: Context<HonoEnv>, next: Next) => {
  try {
    const headerToken = c.req.header('Authorization')?.replace('Bearer ', '')
    const cookieToken = getCookie(c, 'accessToken')
    const token = headerToken || cookieToken

    if (!token) {
      c.set('isAnonymous', true)
      c.set('user', null)
      return await next()
    }

    const decoded = await verifyAccessToken(token)

    if (decoded.type !== 'access') {
      throw new Error('Invalid token type')
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        role: users.role,
        status: users.status,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1)

    if (!user || user.status !== 'active') {
      throw new Error('User not found or inactive')
    }

    c.set('isAnonymous', false)
    c.set('user', user)
  } catch (error) {
    // Silent fail -> marks as anonymous
    c.set('isAnonymous', true)
    c.set('user', null)
  }
  return await next()
}

/**
 * Guards endpoints. Returns 401 if user is not authenticated.
 * Must be used AFTER `authenticate` middleware.
 */
export const requireAuth = async (c: Context<HonoEnv>, next: Next) => {
  const isAnonymous = c.get('isAnonymous')
  const user = c.get('user')

  if (isAnonymous || !user) {
    const errorResponse: ApiResponse = {
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      meta: { timestamp: new Date().toISOString(), requestId: c.get('requestId') || crypto.randomUUID() },
    }
    return c.json(errorResponse, 401)
  }

  return await next()
}

/**
 * Same as requireAuth but also checks for specific roles.
 */
export const requireRole = (roles: ('user' | 'admin')[]) => {
  return async (c: Context<HonoEnv>, next: Next) => {
    const user = c.get('user')
    if (!user || !roles.includes(user.role)) {
      const errorResponse: ApiResponse = {
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
        meta: { timestamp: new Date().toISOString(), requestId: c.get('requestId') || crypto.randomUUID() },
      }
      return c.json(errorResponse, 403)
    }
    return await next()
  }
}
