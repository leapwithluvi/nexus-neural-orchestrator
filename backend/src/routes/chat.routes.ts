import { Hono } from 'hono'
import { authenticate, requireAuth } from '../middleware/auth'
import { chatHandler } from '../handlers/chat.handler'
import { zValidator } from '@hono/zod-validator'
import { chatMessageSchema } from '../validators/schemas'
import type { HonoEnv } from '../types'

const router = new Hono<HonoEnv>()

// All routes require authentication
router.use('/*', authenticate, requireAuth)

router.post('/stream', zValidator('json', chatMessageSchema), chatHandler.stream)

export default router
