import { db } from '../db/client'
import { conversations, messages } from '../db/schema'
import { eq, and, desc } from 'drizzle-orm'

export const conversationService = {
  async getUserConversations(userId: string) {
    return await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.isPinned), desc(conversations.updatedAt))
  },

  async getConversationById(id: string, userId: string) {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.userId, userId)))
      .limit(1)

    if (!conversation) return null

    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(messages.createdAt)

    return { ...conversation, messages: msgs }
  },

  async createConversation(userId: string, title?: string) {
    const [conversation] = await db
      .insert(conversations)
      .values({
        userId,
        title: title || 'New Conversation',
      })
      .returning()
    return conversation
  },

  async updateConversation(id: string, userId: string, data: { title?: string; isPinned?: boolean }) {
    const [updated] = await db
      .update(conversations)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(conversations.id, id), eq(conversations.userId, userId)))
      .returning()
    return updated
  },

  async deleteConversation(id: string, userId: string) {
    const [deleted] = await db
      .delete(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.userId, userId)))
      .returning()
    return deleted
  },
}
