import { Groq } from 'groq-sdk'
import { env } from '../config/env'
import { db } from '../db/client'
import { messages } from '../db/schema'
import { eq } from 'drizzle-orm'
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions'

const groq = new Groq({ apiKey: env.groq.apiKey })


interface ModelConfig {
  id: string
  reasoningEffort: 'medium' | 'default' | null
  priority: number
}

const MODEL_REGISTRY: ModelConfig[] = [
  { id: 'openai/gpt-oss-120b', reasoningEffort: 'medium',  priority: 1 },
  { id: 'openai/gpt-oss-20b',  reasoningEffort: 'medium',  priority: 2 },
  { id: 'qwen/qwen3.6-27b',    reasoningEffort: 'default', priority: 3 },
  { id: 'qwen/qwen3.8-27b',    reasoningEffort: 'default', priority: 4 },
  { id: 'groq/compound',       reasoningEffort: null,      priority: 5 },
  { id: 'groq/compound-mini',  reasoningEffort: null,      priority: 6 },
]


interface CircuitState {
  failedAt: number
  cooldownMs: number
}

const circuitBreaker = new Map<string, CircuitState>()

const RATE_LIMIT_COOLDOWN_MS = 5 * 60 * 1000  // 5 minutes for rate limits
const ERROR_COOLDOWN_MS      = 1 * 60 * 1000  // 1 minute for general errors

function isCircuitOpen(modelId: string): boolean {
  const state = circuitBreaker.get(modelId)
  if (!state) return false
  const recovered = Date.now() - state.failedAt > state.cooldownMs
  if (recovered) circuitBreaker.delete(modelId) // Auto-heal
  return !recovered
}

function tripCircuit(modelId: string, isRateLimit: boolean) {
  circuitBreaker.set(modelId, {
    failedAt: Date.now(),
    cooldownMs: isRateLimit ? RATE_LIMIT_COOLDOWN_MS : ERROR_COOLDOWN_MS,
  })
  console.warn(
    `[Circuit Breaker] Model "${modelId}" tripped. ` +
    `Cooldown: ${isRateLimit ? '5 min (rate limit)' : '1 min (error)'}`
  )
}

// ─── Error Classification ─────────────────────────────────────────────────────
function isRateLimitError(err: any): boolean {
  return err?.status === 429 ||
    err?.error?.code === 'rate_limit_exceeded' ||
    err?.message?.toLowerCase().includes('rate limit')
}

function isRetryableModelError(err: any): boolean {
  // Model overloaded, temporarily unavailable, or context exceeded
  return err?.status === 503 ||
    err?.status === 502 ||
    err?.error?.code === 'model_not_found' ||
    err?.error?.code === 'service_unavailable' ||
    err?.message?.toLowerCase().includes('model is not available')
}

// ─── Core Stream Generator with Fallback ─────────────────────────────────────
async function generateStreamWithFallback(
  payloadMessages: ChatCompletionMessageParam[],
  preferredModel: string
): Promise<{ stream: any; usedModel: string }> {

  // Build priority queue: preferred model first, then rest by priority
  const preferred = MODEL_REGISTRY.find(m => m.id === preferredModel)
  const fallbacks  = MODEL_REGISTRY.filter(m => m.id !== preferredModel).sort((a, b) => a.priority - b.priority)
  const queue: ModelConfig[] = preferred
    ? [preferred, ...fallbacks]
    : [...MODEL_REGISTRY].sort((a, b) => a.priority - b.priority)

  const skipped: string[] = []

  for (const model of queue) {
    // Skip models currently in cooldown
    if (isCircuitOpen(model.id)) {
      skipped.push(model.id)
      continue
    }

    const params: any = {
      messages: payloadMessages,
      model:    model.id,
      temperature:          env.groq.temperature,
      max_completion_tokens: env.groq.maxTokens,
      top_p:  1,
      stop:   null,
      stream: true,
    }

    if (model.reasoningEffort) {
      params.reasoning_effort = model.reasoningEffort
    }

    try {
      console.log(`[Model Router] Trying model: ${model.id}`)
      const stream = await groq.chat.completions.create(params)
      console.log(`[Model Router] ✓ Using model: ${model.id}`)
      return { stream, usedModel: model.id }

    } catch (err: any) {
      const rateLimit   = isRateLimitError(err)
      const retryable   = isRetryableModelError(err)

      if (rateLimit || retryable) {
        tripCircuit(model.id, rateLimit)
        console.warn(`[Model Router] ✗ Skipping ${model.id} → trying next fallback...`)
        continue
      }

      // Non-retryable error (bad request, auth, etc.) — bail immediately
      throw err
    }
  }

  const allSkipped = [...skipped.map(id => `${id} (cooldown)`)]
  throw new Error(
    `[Model Router] All models exhausted. Skipped: ${allSkipped.join(', ')}. ` +
    'Please try again in a few minutes.'
  )
}

// ─── Circuit Breaker Status (for health endpoint / logging) ──────────────────
export function getCircuitBreakerStatus() {
  const status: Record<string, { status: string; cooldownRemaining?: number }> = {}
  for (const model of MODEL_REGISTRY) {
    const state = circuitBreaker.get(model.id)
    if (state) {
      const remaining = Math.max(0, state.cooldownMs - (Date.now() - state.failedAt))
      status[model.id] = {
        status: remaining > 0 ? 'OPEN' : 'RECOVERED',
        cooldownRemaining: remaining > 0 ? Math.round(remaining / 1000) : 0,
      }
    } else {
      status[model.id] = { status: 'CLOSED' }
    }
  }
  return status
}

// ─── Chat Service ─────────────────────────────────────────────────────────────
export const chatService = {
  /**
   * Inserts a new message (user/assistant/system) into the database history.
   */
  async saveMessage(data: {
    conversationId: string
    role: 'user' | 'assistant' | 'system'
    content: string
    tokenCount?: number
  }) {
    const [msg] = await db.insert(messages).values(data).returning()
    return msg
  },

  /**
   * Retrieves the conversation context (past messages) to feed the AI.
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
   * Generates a streaming response with automatic model fallback.
   * Returns both the stream and the model that was actually used.
   */
  async generateStream(payloadMessages: ChatCompletionMessageParam[]) {
    return generateStreamWithFallback(payloadMessages, env.groq.model)
  },

  /**
   * Generates a concise title from the user's first message (runs in background).
   * Falls back gracefully if the primary model is rate-limited.
   */
  async generateTitle(firstMessage: string): Promise<string> {
    const titlePrompt: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: 'You are a title generator. Return ONLY a concise, 3-5 words title summarizing the user prompt. DO NOT include quotes, prefixes, or explanations.'
      },
      { role: 'user', content: firstMessage }
    ]

    // Use the simplest available model for title generation (prefer compound-mini for speed)
    const titleModel = isCircuitOpen('groq/compound-mini') ? env.groq.model : 'groq/compound-mini'

    try {
      const response = await groq.chat.completions.create({
        messages: titlePrompt,
        model: titleModel,
        temperature: 0.3,
        max_completion_tokens: 15,
        stream: false,
      })
      const title = response.choices[0]?.message?.content?.trim() || 'New Conversation'
      return title.replace(/^["']|["']$/g, '') // Strip accidental quotes
    } catch (error) {
      console.error("[Title Gen Error]", error)
      return 'New Conversation'
    }
  }
}
