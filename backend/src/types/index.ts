// ==========================================
// API RESPONSE SHAPE
// ==========================================
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    stack?: string
    details?: Record<string, string[]>
  }
  meta: {
    timestamp: string
    requestId: string
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

// ==========================================
// HONO CONTEXT VARIABLES (typed env)
// ==========================================
export type UserPayload = {
  id: string
  email: string
  username: string | null
  displayName: string | null
  avatarUrl: string | null
  role: 'user' | 'admin'
  status: 'active' | 'inactive' | 'banned'
  emailVerified: boolean
}

export type HonoEnv = {
  Variables: {
    user: UserPayload | null
    isAnonymous: boolean
    requestId: string
  }
}

// ==========================================
// JWT TOKEN PAYLOAD
// ==========================================
export interface TokenPayload {
  userId: string
  email: string
  role: 'user' | 'admin'
  type: 'access' | 'refresh'
  iat?: number
  exp?: number
}
