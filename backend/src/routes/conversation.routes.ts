import { Hono } from 'hono'
import { authenticate, requireAuth } from '../middleware/auth.js'
import { conversationHandler } from '../handlers/conversation.handler.js'
import { zValidator } from '@hono/zod-validator'
import { createConversationSchema, updateConversationSchema } from '../validators/schemas.js'
import type { HonoEnv } from '../types/index.js'

const router = new Hono<HonoEnv>()

// Authentication is required for all endpoints below
router.use('/*', authenticate, requireAuth)

router.get('/', conversationHandler.getAll)
router.get('/:id', conversationHandler.getOne)

router.post('/', zValidator('json', createConversationSchema), conversationHandler.create)

router.patch('/:id', zValidator('json', updateConversationSchema), conversationHandler.update)

router.delete('/:id', conversationHandler.remove)

export default router
