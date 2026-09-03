import { Hono } from 'hono'
import { authenticate, requireAuth } from '../middleware/auth.js'
import { chatHandler } from '../handlers/chat.handler.js'
import { zValidator } from '@hono/zod-validator'
import { chatMessageSchema } from '../validators/schemas.js'
import type { HonoEnv } from '../types/index.js'

const router = new Hono<HonoEnv>()

// All routes require authentication
router.use('/*', authenticate, requireAuth)

router.post('/stream', zValidator('json', chatMessageSchema), chatHandler.stream)

export default router
