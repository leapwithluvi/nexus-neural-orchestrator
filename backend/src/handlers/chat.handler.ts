import type { Context } from 'hono'
import { streamSSE } from 'hono/streaming'
import { chatService } from '../services/chat.service.js'
import { conversationService } from '../services/conversation.service.js'
import { env } from '../config/env.js'
import type { z } from 'zod'
import type { chatMessageSchema } from '../validators/schemas.js'
import type { HonoEnv } from '../types/index.js'

export const chatHandler = {
  async stream(c: Context<HonoEnv>) {
    // Guaranteed by requireAuth middleware
    const user = c.get('user')! 

    const payload = c.req.valid('json' as never) as z.infer<typeof chatMessageSchema>
    let conversationId = payload.conversationId
    let isNewConversation = false

    // Get or create conversation
    if (!conversationId) {
      const conv = await conversationService.createConversation(user.id)
      conversationId = conv.id
      isNewConversation = true
    } else {
      const conv = await conversationService.getConversationById(conversationId, user.id)
      if (!conv) return c.json({ error: 'Conversation not found' }, 404)
      
      // If the frontend created the conversation with a default title, trigger generation
      if (conv.title === 'New Chat' || conv.title === 'New Conversation') {
        isNewConversation = true
      }
    }

    // Fire and forget Auto-Title Generation without awaiting it
    if (isNewConversation) {
      const firstMessage = payload.content
      chatService.generateTitle(firstMessage).then(async (newTitle) => {
        await conversationService.updateConversation(conversationId!, user.id, { title: newTitle })
      }).catch(console.error)
    }

    // Estimate token footprint safely to avoid bleeding budget unmonitored. (1 word is approx 1.3 tokens for LLMs)
    const promptTokens = Math.ceil(payload.content.split(/\s+/).length * 1.3)

    // Save user message
    await chatService.saveMessage({
      conversationId,
      role: 'user',
      content: payload.content,
      tokenCount: promptTokens // Feature Added
    })

    // Load full history as context for Groq
    const history = await chatService.getConversationHistory(conversationId)

    // Inject System Prompt at the beginning of the history
    history.unshift({
      role: 'system',
      content: env.groq.systemPrompt
    })

    // Request streaming completion from Groq (with automatic model fallback)
    const { stream: aiStream, usedModel } = await chatService.generateStream(history)

    // Stream chunks to client via SSE
    // Collect full response, then save to DB once completed
    return streamSSE(c, async (stream) => {
      let fullResponse = ''
      let telemetryData: any = null

      try {
        for await (const chunk of aiStream) {
          // Extract delta content from stream chunk
          const content = chunk.choices?.[0]?.delta?.content || ''
          fullResponse += content

          if (content) {
            await stream.writeSSE({ data: JSON.stringify({ type: 'chunk', content }) })
          }

          // Extract Groq SDK Speed Telemetry (usually available in the final chunk)
          const groqStats = (chunk as any).x_groq?.usage
          if (groqStats) {
            telemetryData = {
              promptTokens: groqStats.prompt_tokens || 0,
              completionTokens: groqStats.completion_tokens || 0,
              totalTokens: groqStats.total_tokens || 0,
              promptTime: groqStats.prompt_time || 0,
              completionTime: groqStats.completion_time || 0,
              totalTime: groqStats.total_time || 0,
              // Calculate Tokens per Second (T/s), fallback to 1 to prevent division by zero
              speed: Math.round((groqStats.completion_tokens || 0) / (groqStats.completion_time || 1)), 
              model: usedModel  // Reflects actual model used (may differ if fallback occurred)
            }
          }
        }

        // Dispatch telemetry data block to UI before closing the stream
        if (telemetryData) {
          await stream.writeSSE({ 
            data: JSON.stringify({ type: 'telemetry', data: telemetryData }) 
          })
        }

        await stream.writeSSE({ data: JSON.stringify({ type: 'done', conversationId }) })
      } catch (e) {
        console.error('[Chat Stream Error]', e)
        await stream.writeSSE({ data: JSON.stringify({ type: 'error', message: 'Stream failed' }) })
      } finally {
        // Always persist the assistant response after stream ends
        if (fullResponse.trim()) {
          const aiResponseTokens = Math.ceil(fullResponse.split(/\s+/).length * 1.3)
          await chatService.saveMessage({
            conversationId: conversationId!,
            role: 'assistant',
            content: fullResponse,
            tokenCount: aiResponseTokens
          })
        }
      }
    })
  },
}
