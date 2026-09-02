<div align="center">

# 🤖 AI Chatbot — Backend

**A blazing-fast AI chat backend built with Hono.js on Bun runtime**

[![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev)
[![Bun](https://img.shields.io/badge/Bun-14151A?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Drizzle](https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team)
[![Groq](https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge)](https://console.groq.com)

</div>

---

## ✨ Features

- ⚡ **Ultra-fast** — Hono.js on Bun runtime, significantly faster than Node.js + Express
- 🔐 **OAuth 2.0** — Passwordless login via Google & GitHub using Arctic (no Passport.js)
- 💬 **AI Streaming** — Real-time SSE streaming responses using Groq (LLaMA 3.3 70B)
- 🗄️ **Type-safe ORM** — Drizzle ORM with full TypeScript inference, zero magic
- 🛡️ **Security built-in** — Secure headers, CORS, httpOnly cookies, JWT rotation, DB-based rate limiting
- ✅ **Validated everywhere** — Zod schema validation on all inputs via `@hono/zod-validator`
- 🔄 **Token Rotation** — Refresh token stored & revoked in DB, preventing token reuse attacks

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Runtime** | [Bun](https://bun.sh) | Fastest JS runtime, built-in `.env` loader, no need for tsx/dotenv |
| **Framework** | [Hono.js](https://hono.dev) | Ultra-lightweight, typed Context, built-in middleware ecosystem |
| **Database ORM** | [Drizzle ORM](https://orm.drizzle.team) | Type-safe, zero-dependency, SQL-first |
| **DB Driver** | `postgres` | Native PostgreSQL driver for Drizzle |
| **OAuth** | [Arctic](https://arctic.js.org) | Replaces Passport.js — minimal, standard-compliant OAuth 2.0 |
| **AI Provider** | [Groq SDK](https://console.groq.com) | LLaMA 3.3 70B with SSE streaming |
| **Validation** | [Zod](https://zod.dev) + `@hono/zod-validator` | Type-safe request body / param validation |
| **JWT** | `hono/jwt` *(built-in)* | Access & refresh token signing + verification |
| **Security** | `hono/secure-headers`, `hono/cors` *(built-in)* | Replaces helmet + cors packages |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── env.ts              # Zod-validated env config — app crashes early if any var is missing
│   ├── db/
│   │   ├── client.ts           # Drizzle client singleton
│   │   └── schema.ts           # Full DB schema (6 tables, 4 enums, indexes, relations)
│   ├── lib/
│   │   ├── jwt.ts              # signAccessToken / signRefreshToken / verify helpers
│   │   └── oauth.ts            # Arctic Google & GitHub instances
│   ├── middleware/
│   │   ├── auth.ts             # authenticate / requireAuth / requireRole
│   │   └── rateLimit.ts        # DB-backed rate limiter (rate_limits table)
│   ├── routes/
│   │   ├── index.ts            # Route aggregator → mounted to /api/v1
│   │   ├── auth.routes.ts      # 10 auth endpoints
│   │   ├── conversation.routes.ts
│   │   └── chat.routes.ts
│   ├── handlers/               # HTTP handler layer (equivalent to controllers)
│   │   ├── auth.handler.ts
│   │   ├── conversation.handler.ts
│   │   └── chat.handler.ts
│   ├── services/               # Business logic layer
│   │   ├── auth.service.ts     # OAuth upsert, token rotation, logout
│   │   ├── conversation.service.ts
│   │   └── chat.service.ts     # Groq SDK + conversation history + SSE
│   ├── validators/
│   │   └── schemas.ts          # All Zod schemas
│   ├── types/
│   │   └── index.ts            # ApiResponse<T>, HonoEnv, TokenPayload
│   └── index.ts                # App entry — Bun.serve({ fetch: app.fetch })
├── drizzle/
│   └── migrations/             # Auto-generated SQL migrations
├── drizzle.config.ts
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Bun** installed → `curl -fsSL https://bun.sh/install | bash`
- **PostgreSQL** running (local or cloud: [Supabase](https://supabase.com), [Neon](https://neon.tech), [Railway](https://railway.app))
- OAuth credentials from [Google Console](https://console.cloud.google.com) and [GitHub Developer Settings](https://github.com/settings/developers)
- Groq API key from [console.groq.com](https://console.groq.com)

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in all values:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ai_chatbot_db
JWT_ACCESS_SECRET=<min-32-chars-random-string>
JWT_REFRESH_SECRET=<another-min-32-chars-random-string>
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GROQ_API_KEY=gsk_...
```

> **Tip:** Generate strong secrets with `openssl rand -base64 48`

### 3. Setup Database

```bash
# Generate SQL from schema
bunx drizzle-kit generate

# Apply migrations to your database
bunx drizzle-kit migrate
```

### 4. Start Development Server

```bash
bun run dev
```

Server starts at **`http://localhost:3001`**

---

## 📡 API Reference

Base URL: `http://localhost:3001/api/v1`

### 🔐 Auth

| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| `GET` | `/auth/google` | — | Initiate Google OAuth flow |
| `GET` | `/auth/google/callback` | — | Google OAuth callback |
| `GET` | `/auth/github` | — | Initiate GitHub OAuth flow |
| `GET` | `/auth/github/callback` | — | GitHub OAuth callback |
| `POST` | `/auth/refresh` | — | Rotate refresh token, get new pair |
| `GET` | `/auth/check` | Optional | Returns `{ isAuthenticated: bool }` |
| `GET` | `/auth/me` | ✅ | Get current authenticated user |
| `PATCH` | `/auth/profile` | ✅ | Update username / displayName / avatarUrl |
| `POST` | `/auth/logout` | ✅ | Revoke current session |
| `POST` | `/auth/logout-all` | ✅ | Revoke all active sessions |

### 💬 Conversations

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/conversations` | List all user conversations (sorted by pinned, then recent) |
| `GET` | `/conversations/:id` | Get a conversation with its full message history |
| `POST` | `/conversations` | Create a new conversation |
| `PATCH` | `/conversations/:id` | Update title or pin/unpin |
| `DELETE` | `/conversations/:id` | Delete conversation (cascades messages) |

All conversation endpoints require authentication.

### 🤖 Chat (SSE Streaming)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/chat/stream` | Send a message and stream AI response via SSE |

**Request body:**
```json
{
  "content": "Explain how Hono.js routing works",
  "conversationId": "optional-uuid-to-continue-existing-conversation"
}
```

**SSE Response stream:**
```
data: {"type":"chunk","content":"Hono"}
data: {"type":"chunk","content":".js uses"}
data: {"type":"chunk","content":" a trie-based router..."}
data: {"type":"done","conversationId":"abc-123"}
```

<details>
<summary><b>💡 Tip: How to consume this SSE Stream in React/Frontend</b></summary>
<br/>

The standard `fetch` API does not natively parse SSE lines. Use `TextDecoder` to stream and parse chunks:

```ts
const response = await fetch('http://localhost:3001/api/v1/chat/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({ content: "Hi AI!" })
})

const reader = response.body?.getReader()
const decoder = new TextDecoder('utf-8')

while (true) {
  const { done, value } = await reader!.read()
  if (done) break

  const chunkStr = decoder.decode(value, { stream: true })
  const splitChunks = chunkStr.split('\n\n')

  for (const str of splitChunks) {
    if (str.startsWith('data: ')) {
      const dataStr = str.replace('data: ', '')
      const parsed = JSON.parse(dataStr)

      if (parsed.type === 'chunk') {
        setAssistantMessage(prev => prev + parsed.content)
      } else if (parsed.type === 'done') {
        console.log('Stream ended! Conversation ID:', parsed.conversationId)
      }
    }
  }
}
```
</details>

The conversation history is automatically loaded from DB as context before each AI request. 
**Auto-Title Feature:** When starting a new conversation (no `conversationId` provided), the backend will automatically spawn a background AI task to generate a 3-5 word title summarizing your first message!

---

## 🔐 Auth & Security Architecture

### OAuth Login Flow
```
Client → GET /api/v1/auth/google
       → 302 Redirect to Google
       → User authenticates with Google
       → Google → GET /api/v1/auth/google/callback?code=...
       → DB Transaction: upsert User + link OAuthAccount
       → Set httpOnly cookies: accessToken (15m) + refreshToken (7d)
       → 302 Redirect to frontend /?login=success
```

### Token Rotation
```
Client → POST /auth/refresh { refreshToken }
       → Verify JWT signature + check DB (not revoked, not expired)
       → Revoke old refresh token in DB
       → Issue new accessToken + refreshToken pair
       → Return new accessToken in body + set cookies
```

### Rate Limiting

Rate limits are enforced per-endpoint, backed by the `rate_limits` PostgreSQL table:

| Client Type | Limit | Window |
|---|---|---|
| Anonymous (by IP) | 10 requests | 1 hour |
| Authenticated (by user ID) | 100 requests | 1 hour |

---

## ⚙️ Scripts

```bash
bun run dev                  # Start hot-reload dev server
bunx drizzle-kit generate    # Generate SQL migrations from schema changes
bunx drizzle-kit migrate     # Apply pending migrations to database
bunx drizzle-kit studio      # Open Drizzle Studio — visual DB browser
```

---

## 🗄️ Database Schema

```
users ──────────────── oauth_accounts (provider, providerId)
  │                  └─ refresh_tokens (token rotation)
  └── conversations ─── messages (role, content, tokenCount, latency)

rate_limits (identifier, endpoint, count, expiresAt)
```

All tables use **UUID primary keys** generated by PostgreSQL (`defaultRandom()`).
Cascading deletes are configured: deleting a user removes all their data.

---

<div align="center">

**Hono + Bun + Drizzle + Arctic + Groq**

*Minimal dependencies. Maximum performance.*

</div>
