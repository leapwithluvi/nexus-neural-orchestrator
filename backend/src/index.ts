import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { compress } from 'hono/compress'
import { env } from './config/env.js'
import type { ApiResponse } from './types/index.js'

declare const process: any;

const app = new Hono()

// ==========================================
// GLOBAL MIDDLEWARE
// ==========================================

import { csrf } from 'hono/csrf'
import { bodyLimit } from 'hono/body-limit'

// Payload Size Limit
app.use(
  bodyLimit({
    maxSize: 5 * 1024 * 1024,
    onError: (c) => c.json({ success: false, error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body is too large' } }, 413),
  })
)

const allowedOrigins = Array.isArray(env.cors.origin)
  ? env.cors.origin
  : typeof env.cors.origin === 'string'
    ? (env.cors.origin as string).split(',').map(o => o.trim())
    : [];

app.use(
  csrf({
    origin: (origin) => {
      return !origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost')
    },
  })
)

// Request logging
app.use(logger())

// Security headers
app.use(secureHeaders())

app.use(
  cors({
    origin: (origin) => {
      if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost')) {
        return origin
      }
      return allowedOrigins[0] || 'http://localhost:3000'
    },
    credentials: env.cors.credentials,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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

import apiRouter from './routes/index.js'

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
// EXPPORT APP
// ==========================================
export default app
