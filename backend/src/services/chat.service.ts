import { Groq } from 'groq-sdk'
import { env } from '../config/env'
import { db } from '../db/client'
import { messages } from '../db/schema'
import { eq } from 'drizzle-orm'
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions'

const groq = new Groq({ apiKey: env.groq.apiKey })

export const chatService = {
  /**
   * Inserts a new message (user/assistant/system) into the database history.
   */
  async saveMessage(data: { conversationId: string; role: 'user' | 'assistant' | 'system'; content: string; tokenCount?: number }) {
    const [msg] = await db.insert(messages).values(data).returning()
    return msg
  },

  /**
   * Retrieves the conversation context (past messages) to be included in the AI request.
   */
  async getConversationHistory(conversationId: string): Promise<ChatCompletionMessageParam[]> {
    const history = await db
      .select({ role: messages.role, content: messages.content })
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt)

    return history as ChatCompletionMessageParam[]
  },

  /**
   * Generates a streaming response from the Groq API.
   */
  async generateStream(payloadMessages: ChatCompletionMessageParam[]) {
    return await groq.chat.completions.create({
      messages: payloadMessages,
      model: env.groq.model,
      temperature: env.groq.temperature,
      max_tokens: env.groq.maxTokens,
      // Mandatory for Server Sent Events (SSE)
      stream: true, 
    })
  },

  /**
   * Generates a concise title from the user's first message (run in background).
   * Not streamed.
   */
  async generateTitle(firstMessage: string): Promise<string> {
    try {
      const response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a title generator. Return ONLY a concise, 3-5 words title summarizing the user prompt. DO NOT include quotes or prefixes.' },
          { role: 'user', content: firstMessage }
        ],
        model: env.groq.model,
        temperature: 0.3,
        max_tokens: 15,
        stream: false,
      })
      const title = response.choices[0]?.message?.content?.trim() || 'New Conversation'
      // Clean up accidental quotes from LLM
      return title.replace(/^["']|["']$/g, '') 
    } catch {
      return 'New Conversation'
    }
  }
}
