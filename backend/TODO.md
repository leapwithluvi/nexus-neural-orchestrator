# 🚀 Backend Migration Plan — Hono.js + Bun + Drizzle

> **Stack baru**: Bun (runtime) + Hono (framework) + Drizzle ORM (database) + Arctic (OAuth)
> **Backend lama** (Express.js) sudah di-backup di `/backup/backend_backup`

---

## 🎯 Final Tech Stack

| Layer | Library | Keterangan |
|---|---|---|
| **Runtime** | `bun` | Bundler + runner, menggantikan Node.js + tsx |
| **Framework** | `hono` | Ultra-fast web framework |
| **ORM** | `drizzle-orm` | Type-safe, lightweight, Bun-native |
| **DB Driver** | `postgres` | Driver PostgreSQL untuk Drizzle |
| **OAuth** | `arctic` | OAuth 2.0 (Google, GitHub), ringan tanpa Passport |
| **Validation** | `@hono/zod-validator` + `zod` | Hono-native request validation |
| **JWT** | `hono/jwt` *(built-in)* | Middleware JWT bawaan Hono |
| **CORS** | `hono/cors` *(built-in)* | Tidak perlu install terpisah |
| **Security** | `hono/secure-headers` *(built-in)* | Menggantikan helmet |
| **Cookie** | `hono/cookie` *(built-in)* | Menggantikan cookie-parser |
| **Logger** | `hono/logger` *(built-in)* | Menggantikan morgan/pino |
| **Compress** | `hono/compress` *(built-in)* | Menggantikan compression |
| **AI** | `groq-sdk` | Groq LLM + streaming |
| **Crypto** | `bcryptjs` | Hashing untuk token storage |

---

<!-- ## 📦 Install Commands

```bash
# Init project Bun
bun init -y

# Install production dependencies
bun add hono arctic drizzle-orm postgres groq-sdk zod @hono/zod-validator bcryptjs

# Install dev dependencies
bun add -D drizzle-kit @types/bcryptjs
```

> **Tidak perlu install**: `cors`, `helmet`, `morgan`, `compression`, `cookie-parser`,
> `passport`, `passport-google-oauth20`, `passport-github2`, `@types/express`, `tsx`, `tsx` →
> Semua sudah dari ekosistem Hono atau sudah tersedia di Bun native. -->

---

## 🗺️ Struktur Folder

```
backend/
├── src/
│   ├── index.ts                  # Entry: Hono app + Bun.serve()
│   ├── config/
│   │   └── env.ts                # Zod env validation
│   ├── db/
│   │   ├── client.ts             # Drizzle client singleton
│   │   └── schema.ts             # Drizzle schema (port dari Prisma)
│   ├── lib/
│   │   ├── oauth.ts              # Arctic providers (Google, GitHub)
│   │   └── jwt.ts                # sign/verify helper pakai hono/jwt
│   ├── middleware/
│   │   ├── auth.ts               # JWT middleware (Hono Context style)
│   │   └── rateLimit.ts          # Rate limiting via DB
│   ├── routes/
│   │   ├── index.ts              # Route aggregator
│   │   ├── auth.routes.ts        # Auth routes
│   │   ├── conversation.routes.ts
│   │   └── chat.routes.ts
│   ├── handlers/
│   │   ├── auth.handler.ts       # Auth handlers (setara controller)
│   │   ├── conversation.handler.ts
│   │   └── chat.handler.ts
│   ├── services/
│   │   ├── auth.service.ts       # Business logic: upsert user, token rotation
│   │   ├── conversation.service.ts
│   │   └── chat.service.ts       # Groq SDK + SSE streaming
│   ├── validators/
│   │   └── schemas.ts            # Zod schemas (dipakai @hono/zod-validator)
│   └── types/
│       └── index.ts              # Shared types + Hono env types
├── drizzle/
│   └── migrations/               # Auto-generated oleh drizzle-kit
├── drizzle.config.ts             # Drizzle Kit config
├── package.json
├── tsconfig.json
├── bunfig.toml                   # Bun config (opsional)
├── .env
└── .env.example
```

---

## 📋 TODO Tickets

### 🏗️ FASE 1 — Project Setup
- [x] **TICKET-001** | Inisialisasi project dengan Hono project initializer:
  ```bash
  bun create hono@latest . --template bun --install
  ```
  > **Kenapa `--template bun`?**
  > Template Hono dibedakan berdasarkan target deployment environment. Template seperti
  > `cloudflare-workers`, `vercel`, dan `aws-lambda` adalah untuk **serverless/edge** —
  > di environment tersebut tidak ada persistent DB connection dan SSE streaming Groq
  > tidak bisa berjalan lama. Kita butuh **long-running server** biasa di VPS/lokal,
  > dan template `bun` sudah siap untuk itu: entry point `src/index.ts` dengan
  > `Bun.serve()`, `tsconfig.json`, dan Hono sudah terinstall — langsung `bun run dev`.

- [x] **TICKET-002** | Install dependencies tambahan:
  ```bash
  bun add arctic drizzle-orm postgres groq-sdk zod @hono/zod-validator bcryptjs
  bun add -D drizzle-kit @types/bcryptjs
  ```
- [x] **TICKET-003** | Verifikasi `tsconfig.json` → pastikan target ESNext dan `types: ["bun-types"]`
- [x] **TICKET-004** | Buat `src/config/env.ts` → validasi env vars dengan Zod
- [x] **TICKET-005** | Buat `drizzle.config.ts` → konfigurasi Drizzle Kit

---

### 🗄️ FASE 2 — Database Schema (Drizzle)
- [ ] **TICKET-006** | Port `prisma/schema.prisma` → `src/db/schema.ts` (Drizzle schema)
  - Table: `users`, `oauth_accounts`, `refresh_tokens`, `conversations`, `messages`, `rate_limits`
  - Port semua enum, index, dan relasi
- [ ] **TICKET-007** | Buat `src/db/client.ts` → Drizzle + postgres singleton
- [ ] **TICKET-008** | Jalankan `bunx drizzle-kit generate` → generate SQL migrations
- [ ] **TICKET-009** | Jalankan `bunx drizzle-kit migrate` → apply ke database

---

### 🔧 FASE 3 — Core Application
- [ ] **TICKET-010** | Buat `src/index.ts` → Hono app entry, `Bun.serve({ fetch: app.fetch })`
- [ ] **TICKET-011** | Setup global middleware:
  - `hono/logger` — request logging
  - `hono/secure-headers` — security headers
  - `hono/cors` — CORS config
  - `hono/compress` — response compression
  - `hono/cookie` — cookie helper
- [ ] **TICKET-012** | Buat `/health` endpoint
- [ ] **TICKET-013** | Setup `app.onError()` → global error handler dengan format `ApiResponse`
- [ ] **TICKET-014** | Setup `app.notFound()` → 404 handler

---

### 🔐 FASE 4 — Auth System
- [ ] **TICKET-015** | Buat `src/lib/oauth.ts` → Arctic setup untuk Google & GitHub
- [ ] **TICKET-016** | Buat `src/lib/jwt.ts` → sign/verify access & refresh token menggunakan `hono/jwt`
- [ ] **TICKET-017** | Buat `src/middleware/auth.ts` → JWT middleware dengan Hono `Context` typed env
- [ ] **TICKET-018** | Buat `src/services/auth.service.ts` → upsert user, token rotation, logout
- [ ] **TICKET-019** | Buat `src/handlers/auth.handler.ts` → semua auth handlers
- [ ] **TICKET-020** | Buat `src/routes/auth.routes.ts` dengan `@hono/zod-validator`:
  - `GET /auth/google` → redirect ke Google OAuth
  - `GET /auth/google/callback` → callback handler
  - `GET /auth/github` → redirect ke GitHub OAuth
  - `GET /auth/github/callback` → callback handler
  - `POST /auth/refresh` → token rotation
  - `POST /auth/logout` → *[require auth]*
  - `POST /auth/logout-all` → *[require auth]*
  - `GET /auth/me` → *[require auth]*
  - `GET /auth/check` → optional auth
  - `PATCH /auth/profile` → *[require auth]* + zod validation

---

### 💬 FASE 5 — Conversation & Chat
- [ ] **TICKET-021** | Buat `src/services/conversation.service.ts` → CRUD conversations + messages via Drizzle
- [ ] **TICKET-022** | Buat `src/handlers/conversation.handler.ts`
- [ ] **TICKET-023** | Buat `src/routes/conversation.routes.ts` → semua *[require auth]*
- [ ] **TICKET-024** | Buat `src/services/chat.service.ts` → Groq SDK + streaming response
- [ ] **TICKET-025** | Buat `src/handlers/chat.handler.ts` → gunakan `streamSSE` dari `hono/streaming`
- [ ] **TICKET-026** | Buat `src/routes/chat.routes.ts`

---

### 🛡️ FASE 6 — Validation & Security
- [ ] **TICKET-027** | Buat `src/validators/schemas.ts` → Zod schemas (port dari backup)
- [ ] **TICKET-028** | Buat `src/middleware/rateLimit.ts` → DB-based rate limiting via `rate_limits` table
- [ ] **TICKET-029** | Buat `src/types/index.ts` → Hono `Env` type untuk Context typing (user, isAnonymous)

---

### ✅ FASE 7 — Finalisasi
- [ ] **TICKET-030** | Aggregasi semua routes di `src/routes/index.ts`
- [ ] **TICKET-031** | Test semua endpoint (curl / Hoppscotch / Bruno)
- [ ] **TICKET-032** | Update `.env.example`
- [ ] **TICKET-033** | Update `README.md`

---

## ⚡ Express vs Hono — Perbandingan Kode

### Handler Pattern
```ts
// Express (lama)
const handler = (req: Request, res: Response, next: NextFunction) => {
  res.json({ success: true })
}

// Hono (baru)
const handler = (ctx: Context) => {
  return ctx.json({ success: true })
}
```

### Validation dengan @hono/zod-validator
```ts
// Express (lama) — custom validate middleware
router.post('/profile', validate(updateProfileSchema), handler)

// Hono (baru) — native
app.post('/profile', zValidator('json', updateProfileSchema), (ctx) => {
  const body = ctx.req.valid('json') // fully typed!
  return ctx.json({ success: true })
})
```

### Streaming SSE (Chat)
```ts
// Hono (baru) — built-in streamSSE
import { streamSSE } from 'hono/streaming'

app.get('/chat', (ctx) => {
  return streamSSE(ctx, async (stream) => {
    for await (const chunk of groqStream) {
      await stream.writeSSE({ data: chunk })
    }
  })
})
```

---

## 🚦 Mulai dari mana?

**→ TICKET-001 s.d. TICKET-009 (Fase 1 & 2) dulu.**

Drizzle schema harus selesai sebelum services bisa ditulis.
Urutan pengerjaan: ikuti nomor ticket secara berurutan.
