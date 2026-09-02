import { Hono } from 'hono'
import authRoutes from './auth.routes'
import conversationRoutes from './conversation.routes'
import chatRoutes from './chat.routes'
import { rateLimit } from '../middleware/rateLimit'
import type { HonoEnv } from '../types'

const apiRouter = new Hono<HonoEnv>()

// Apply Global Rate Limiter to all grouped API routes
apiRouter.use('/*', rateLimit)

apiRouter.route('/auth', authRoutes)
apiRouter.route('/conversations', conversationRoutes)
apiRouter.route('/chat', chatRoutes)

export default apiRouter
