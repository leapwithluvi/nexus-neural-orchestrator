import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { compress } from 'hono/compress'
import { env } from './config/env'
import type { ApiResponse } from './types'

const app = new Hono()

// ==========================================
// GLOBAL MIDDLEWARE
// ==========================================

import { csrf } from 'hono/csrf'
import { bodyLimit } from 'hono/body-limit'

// Payload Size Limit (Prevents DoS attacks from giant payloads)
// Limits the maximum request payload to 5MB
app.use(
  bodyLimit({
    maxSize: 5 * 1024 * 1024,
    onError: (c) => c.json({ success: false, error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body is too large' } }, 413),
  })
)

// CSRF Protection (Prevents Cross-Site Request Forgery)
app.use(
  csrf({
    origin: (origin) => {
      // Allow requests from the configured frontend URL or local development
      return env.cors.origin.includes(origin) || origin.startsWith('http://localhost')
    },
  })
)

// Request logging
app.use(logger())

// Security headers (replaces helmet)
app.use(secureHeaders())

// CORS
app.use(
  cors({
    origin: env.cors.origin,
    credentials: env.cors.credentials,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Set-Cookie'],
  }),
)

// Compression
app.use(compress())

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/health', (c) => {
  return c.json<ApiResponse>({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      env: env.nodeEnv,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
    },
  })
})

import apiRouter from './routes/index'

// ==========================================
// API ROUTES
// ==========================================
app.route(env.apiPrefix, apiRouter)

// ==========================================
// ERROR HANDLERS
// ==========================================

// 404 Not Found
app.notFound((c) => {
  const response: ApiResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${c.req.method} ${c.req.path} not found`,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
    },
  }
  return c.json(response, 404)
})

// Global Error Handler
app.onError((err, c) => {
  console.error('[Error]', err)

  const response: ApiResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.isDev ? err.message : 'An unexpected error occurred',
      ...(env.isDev && { stack: err.stack }),
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
    },
  }

  return c.json(response, 500)
})

// ==========================================
// START SERVER
// ==========================================
export default {
  port: env.port,
  fetch: app.fetch,
}
