import { z } from 'zod'

const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  BACKEND_URL: z.string().url().default('http://localhost:3001'),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 chars'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),

  // OAuth — Google
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),

  // OAuth — GitHub
  GITHUB_CLIENT_ID: z.string().min(1, 'GITHUB_CLIENT_ID is required'),
  GITHUB_CLIENT_SECRET: z.string().min(1, 'GITHUB_CLIENT_SECRET is required'),

  // Groq AI
  GROQ_API_KEY: z.string().min(1, 'GROQ_API_KEY is required'),
  GROQ_MODEL: z.string().default('openai/gpt-oss-120b'),
  GROQ_MAX_TOKENS: z.coerce.number().default(2048),
  GROQ_TEMPERATURE: z.coerce.number().min(0).max(2).default(1),
  GROQ_SYSTEM_PROMPT: z.string().default('You are a helpful, expert AI assistant. Write concisely and use Markdown formatting.'),

  // CORS (comma-separated origins, e.g. "http://localhost:3000,https://myapp.com")
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
})

// Validate at startup — throws with clear error if any env var is missing/invalid
const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const msg = '❌ Invalid environment variables:\n' + JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)
  throw new Error(msg)
}

const _env = parsed.data

// Export structured config object (same shape as backup config/index.ts)
export const env = {
  nodeEnv: _env.NODE_ENV,
  port: _env.PORT,
  apiPrefix: '/api/v1',
  frontendUrl: _env.FRONTEND_URL,
  backendUrl: _env.BACKEND_URL,
  isDev: _env.NODE_ENV === 'development',
  isProd: _env.NODE_ENV === 'production',

  db: {
    url: _env.DATABASE_URL,
  },

  jwt: {
    accessSecret: _env.JWT_ACCESS_SECRET,
    refreshSecret: _env.JWT_REFRESH_SECRET,
    accessExpiry: '15m',
    refreshExpiry: '7d',
  },

  oauth: {
    google: {
      clientId: _env.GOOGLE_CLIENT_ID,
      clientSecret: _env.GOOGLE_CLIENT_SECRET,
      callbackUrl: `${_env.BACKEND_URL}/api/v1/auth/google/callback`,
    },
    github: {
      clientId: _env.GITHUB_CLIENT_ID,
      clientSecret: _env.GITHUB_CLIENT_SECRET,
      callbackUrl: `${_env.BACKEND_URL}/api/v1/auth/github/callback`,
    },
  },

  groq: {
    apiKey: _env.GROQ_API_KEY,
    model: _env.GROQ_MODEL,
    maxTokens: _env.GROQ_MAX_TOKENS,
    temperature: _env.GROQ_TEMPERATURE,
    systemPrompt: _env.GROQ_SYSTEM_PROMPT,
  },

  cors: {
    origin: _env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
  },

  rateLimit: {
    anonChatLimit: 10,
    authChatLimit: 100,
    windowMs: 60 * 60 * 1000, // 1 hour in ms
  },
} as const
