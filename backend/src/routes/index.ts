import { Hono } from 'hono'
import authRoutes from './auth.routes.js'
import conversationRoutes from './conversation.routes.js'
import chatRoutes from './chat.routes.js'
import { rateLimit } from '../middleware/rateLimit.js'
import type { HonoEnv } from '../types/index.js'

const apiRouter = new Hono<HonoEnv>()

// Apply Global Rate Limiter to all grouped API routes
apiRouter.use('/*', rateLimit)

apiRouter.route('/auth', authRoutes)
apiRouter.route('/conversations', conversationRoutes)
apiRouter.route('/chat', chatRoutes)

export default apiRouter
