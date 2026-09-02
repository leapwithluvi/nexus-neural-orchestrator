import type { Context } from 'hono'
import { conversationService } from '../services/conversation.service'
import type { HonoEnv, ApiResponse } from '../types'
import type { z } from 'zod'
import type { createConversationSchema, updateConversationSchema } from '../validators/schemas'

const createSuccess = <T>(data: T, c: Context): ApiResponse<T> => ({
  success: true,
  data,
  meta: { timestamp: new Date().toISOString(), requestId: c.get('requestId') || '' },
})

export const conversationHandler = {
  async getAll(c: Context<HonoEnv>) {
    const user = c.get('user')!
    const items = await conversationService.getUserConversations(user.id)
    return c.json(createSuccess(items, c))
  },

  async getOne(c: Context<HonoEnv>) {
    const id = c.req.param('id')!
    const user = c.get('user')!
    const conversation = await conversationService.getConversationById(id, user.id)

    if (!conversation) return c.json({ error: 'Conversation not found' }, 404)
    return c.json(createSuccess(conversation, c))
  },

  async create(c: Context<HonoEnv>) {
    const user = c.get('user')!
    const data = c.req.valid('json' as never) as z.infer<typeof createConversationSchema>
    
    const conversation = await conversationService.createConversation(user.id, data.title)
    return c.json(createSuccess(conversation, c), 201)
  },

  async update(c: Context<HonoEnv>) {
    const id = c.req.param('id')!
    const user = c.get('user')!
    const data = c.req.valid('json' as never) as z.infer<typeof updateConversationSchema>

    const updated = await conversationService.updateConversation(id, user.id, data)
    if (!updated) return c.json({ error: 'Conversation not found' }, 404)
    return c.json(createSuccess(updated, c))
  },

  async remove(c: Context<HonoEnv>) {
    const id = c.req.param('id')!
    const user = c.get('user')!

    const deleted = await conversationService.deleteConversation(id, user.id)
    if (!deleted) return c.json({ error: 'Conversation not found' }, 404)
    return c.json(createSuccess({ deletedId: deleted.id }, c))
  },
}
