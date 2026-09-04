# Nexus Neural Orchestrator — Fullstack AI Chatbot

<!-- GitHub badges -->
[![Stars](https://img.shields.io/github/stars/leapwithluvi/nexus-neural-orchestrator?style=social)](https://github.com/leapwithluvi/nexus-neural-orchestrator/stargazers)
[![Fork](https://img.shields.io/github/forks/leapwithluvi/nexus-neural-orchestrator?style=social)](https://github.com/leapwithluvi/nexus-neural-orchestrator/forks)
[![GitHub commits](https://img.shields.io/github/commit-activity/t/leapwithluvi/nexus-neural-orchestrator?style=social&logo=github)](https://github.com/leapwithluvi/nexus-neural-orchestrator/commits)
[![Pull requests](https://img.shields.io/github/issues-pr/leapwithluvi/nexus-neural-orchestrator?style=social&logo=github)](https://github.com/leapwithluvi/nexus-neural-orchestrator/pulls)

![Nexus AI Showcase](./frontend/public/implement1.mp4)

[![leapwithluvi](https://custom-icon-badges.demolab.com/badge/made%20by%20-leapwithluvi-556bf2?logo=github&logoColor=white&labelColor=101827)](https://github.com/leapwithluvi)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?color=dddddd&labelColor=000000)](https://github.com/leapwithluvi/nexus-neural-orchestrator/blob/main/LICENSE)
[![Top Language](https://img.shields.io/github/languages/top/leapwithluvi/nexus-neural-orchestrator?logo=github&logoColor=%23007ACC&label=TypeScript)](https://www.typescriptlang.org/)
![PRs](https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=shields)
![Status](https://img.shields.io/badge/Status-Active-success)
![Vercel](https://img.shields.io/badge/Vercel-Deployment--Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)

# Live Preview

![Nexus AI Showcase #2](./frontend/public/implement2.mp4)

**[Visit Nexus AI Live → nexusai.my.id](https://www.nexusai.my.id)**

---

## Table of Contents

<details><summary>Click to expand</summary>

- [About The Project](#-about-the-project)
- [Key Features Highlights](#-key-features-highlights)
- [Comprehensive Features](#-comprehensive-features)
- [Technologies Used](#-technologies-used)
- [Architecture & Layout](#-architecture--layout)
- [Get Started (Setup & DB)](#-get-started--local-development)
- [How to Use](#-how-to-use-guide)
- [API Reference](#-api-reference)
- [Security Recommendations](#-security-recommendations)
- [Featured Projects](#-featured-projects)
- [Contact](#-contact)
- [License](#-license)

</details>

<br>

---

## About The Project

**Nexus Neural Orchestrator** is a modern, high-performance Fullstack AI Chatbot built as a portfolio project to demonstrate end-to-end system architecture. 

### The Problem
Most portfolio AI chatbots are simple wrappers around an API (relying heavily on the frontend), lacking real session management, secure backend routing, relational database storage, and proper stream handling. Developers usually get locked into SaaS template logic without understanding the underlying connections.

### The Solution
This project breaks that barrier by implementing a strict **Monorepo Separation of Concerns**. The Client (Next.js) only handles rendering and context, while the Backend (Bun + Hono) securely manages OAuth protocols, database logic (Neon + Drizzle), and direct Server-Sent Events (SSE) streaming with the Groq Inference Engine.

### Why I Built This
This platform was built to validate my full-stack capabilities—specifically tackling the complexities of **Real-Time Data Streaming, HTTP-Only Cookie Authentication, Database Schema Design, and UI/UX Layout Syncing**. 

---

## Key Features Highlights

- **Blazing Fast Streaming**: Real-time AI chat stream leveraging **Groq LPU** inference and SSE architecture via Hono.
- **Secure OAuth Ecosystem**: Fully backend-managed GitHub and Google login procedures.
- **Glassmorphism & State Precision**: A sleek User Interface styled with **Tailwind 4.0** and **Shadcn**, immune to internal layout race-conditions.
- **Relational Database Schema**: Structured and typed data modeling via **Drizzle ORM** connected to a serverless **Neon Postgres** instance.

## Comprehensive Features

<details><summary><b>Frontend Capabilities</b></summary>
  
  - Intelligent Dynamic Hydration protecting against blank loading skeletons.
  - Native Context management handling HTTP 401s and automatic seamless URL rewrites.
  - Granular Z-Index management catering to precise Mobile Sheet interaction.
  - Full Responsive grid mapping adapting automatically across viewports.

</details>

<details><summary><b>Backend Capabilities</b></summary>

  - Sub-millisecond performance boot routing mapped across an optimized **Bun** environment.
  - Extensive **Zod** request validation (`@hono/zod-validator`) shielding endpoints from injection vectors.
  - Embedded Global Rate-Limiting middleware stopping malicious continuous hits.
  - JWT integration enforcing strict session cookies bound securely via `httpOnly` flags.

</details>

---

## Technologies Used

Built with a modern, high-performance web engineering stack:

- **Frontend:** [Next.js 16](https://nextjs.org/) / React 19, [Tailwind CSS 4.0](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Backend:** [Bun](https://bun.sh/) runtime, [Hono](https://hono.dev/) framework
- **Database:** [Neon Serverless Postgres](https://neon.tech/), [Drizzle ORM](https://orm.drizzle.team/)
- **Inference AI:** [Groq LPU Engine](https://groq.com/)

<br/>

<div align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,bun,postgres,vercel,github&theme=dark" alt="Technologies Used" />
  </a>
</div>

<br/>

---

## Architecture & Layout

This codebase features a strongly opinionated Monorepo layout. Here is a breakdown of the critical directories defining the logic in `src/`.

<details><summary><b>Frontend Layout (Next.js)</b></summary>

```bash
frontend/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (Root UI, /login, /overview, /settings, /register)
│   ├── assets/             # Centralized global CSS stylings and SVGs
│   ├── components/         # Pure React UI block implementations (Shadcn, Interactivity modules)
│   ├── context/            # React Contexts intercepting API responses and user sessions
│   ├── data/               # Highly categorized static dictionaries (Pricing config, TechStack, Metadata)
│   ├── hooks/              # Reusable React UI Hooks
│   ├── interfaces/         # Pure TypeScript type/interface bounds for the UI
│   └── lib/                # Shared utilities and fetch interceptors (e.g., api.ts wrapper)
```

</details>

<details><summary><b>Backend Layout (Bun & Hono)</b></summary>

```bash
backend/
├── src/
│   ├── config/             # Strict Environment and runtime configuration loader
│   ├── db/                 # Drizzle schemas defining Postgres definitions mapped to instance connection
│   ├── handlers/           # Route Business Logic Executors (Auth, DB logic, Streaming orchestration)
│   ├── lib/                # Shared helpers (Logger, etc.)
│   ├── middleware/         # Security checks (JWT Decoder, Rate Limiter execution, Role parsing)
│   ├── routes/             # Hono Router mounting logic combining routes and handlers
│   ├── services/           # Specialized API communication (Direct Groq fetches, Token generation logic)
│   ├── types/              # Global internal configurations (HonoEnv types)
│   ├── validators/         # Zod Schemas validating JSON payloads across API endpoints
│   └── index.ts            # Entry Point, Middleware mount context, Security Header application
```

</details>

---

## Get Started & Local Development

> [!WARNING]
> You must run both the Frontend and Backend concurrently to ensure the application communicates properly.

### 1. Repository Setup

```bash
git clone https://github.com/leapwithluvi/nexus-neural-orchestrator.git
cd nexus-neural-orchestrator
```

### 2. Environment Variables

> [!IMPORTANT]
> Make sure to secure your API connections. Never push `.env` files to a public repository!

Create the respective `.env` and `.env.local` files based on `.env.example` in both workspaces.

**Backend (`backend/.env`)**
```env
# App Info
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# Drizzle ORM PostGres Connection URL
DATABASE_URL=postgresql://user:password@localhost:5432/ai_chatbot_db

# Security & JWT Tokens
JWT_ACCESS_SECRET="generate-a-very-long-secret-key-that-is-min-32-chars-long!"
JWT_REFRESH_SECRET="generate-another-very-long-secret-key-that-is-min-32-chars-long!"

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth Credentials
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# AI Groq SDK Configuration
GROQ_API_KEY=gsk_your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_MAX_TOKENS=4096
GROQ_TEMPERATURE=0.7
GROQ_SYSTEM_PROMPT="You are a helpful and expert AI assistant. Answer concisely and use markdown formatting."

# Allowed Browsers (Comma separated arrays)
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
```

**Frontend (`frontend/.env.local`)**
```env
# Backend API base URL (Hono.js server)
# Development: http://localhost:3001
# Production:  https://api.yourdomain.com
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Database Setup (Drizzle & Postgres)

You must run the database migrations in the `backend/` directory to create the schemas on your database instance.

```bash
cd backend
bun install
# Generate tables based on your schema definition
bun run db:generate

# Execute the migrations mapping schema into the Neon DB
bun run db:migrate
```

### 4. Run Development Servers

**Run the Backend Engine (Terminal 1):**
```bash
cd backend
bun run dev
```

**Run the Client Interface (Terminal 2):**
```bash
cd frontend
npm install
npm run dev
```

> [!NOTE]
> Navigate to `http://localhost:3000` to interact with your local instance of Nexus.

---

## How to Use Guide

<details><summary><b>Interacting with the Application</b></summary>

1. **Anonymous Mode**: Visitors can explore the `/overview` landing page and view the structure of the Chat Interface `/` without an account.
2. **Accessing Protocol**: Pressing the `Login Now` or `Initiate Protocol` prompts the OAuth dialog.
3. **Conversations**: Once logged in, type your query. The AI will stream the query instantly. 
4. **History sync**: Click the `New Chat` icon on the Sidebar. The Database only registers the new chat upon your first transmission to prevent DB spam.
5. **Editing State**: The sidebar allows renaming or deleting old conversations.
6. **Session Handling**: All expired token requests or forced manual actions naturally resolve back up preventing UI soft-locking.

</details>

---

## API Reference

> [!NOTE]
> Detailed JSON response payloads rely strictly on internal Schema format bindings. Main endpoints sit at `api/v1/`.

<details><summary><b>Endpoints Breakdown</b></summary>

### System
- `GET /health` : Performs an overall pulse check across backend configurations.

### Authentication
- `GET /api/v1/auth/session` : Validates HTTP-Only token and returns user payload.
- `GET /api/v1/auth/github` : Redirects to GitHub OAuth.
- `POST /api/v1/auth/logout` : Safely clears backend cookie sessions.

### Conversations
- `GET /api/v1/conversations` : Fetches user's chat history sidebar metadata.
- `POST /api/v1/conversations` : Initiates a new conversation ID shell.
- `GET /api/v1/conversations/:id` : Restores entire specific chat message payload.
- `PATCH /api/v1/conversations/:id` : Renames the conversation title.
- `DELETE /api/v1/conversations/:id` : Soft/Hard deletes the target conversation.

### Chat Inference
- `POST /api/v1/chat/stream` : Initiates the main Server-Sent-Events (SSE) pipeline querying Groq response vectors. Uses strictly validated Zod parsing.

</details>

---

## Security Recommendations

If you plan to utilize this Monorepo as a foundational framework for actual production, I have ensured these baseline security rules exist but recommend further review:

> [!CAUTION]
> **CORS Declarations**: By default, `backend/src/index.ts` enforces origin checks resolving entirely relying on the `CORS_ORIGIN` arrays found in the env. Validate these entries correctly inside production deployments to avoid unauthorized API fetches.

> [!WARNING]
> **Strict Cookies**: Ensure `/api/v1/auth` cookie configuration flags use `{ httpOnly: true, secure: true, sameSite: 'none' }` during HTTPS production to explicitly avoid Client-Side Token extraction vectors.

> [!TIP]
> **API Rate-Limiting Implementation**: This codebase applies a Global Rate Limiter middleware (`apiRouter.use('/*', rateLimit)`). Verify limits matching expected throughputs per user identity to prevent abuse across your `Groq API` consumption.

---

## Featured Projects

| Project Name | Description / Details | Link |
| :--- | :--- | :--- |
| **Portfolio V1 (Vite + React)** | Legacy Personal Website | [GitHub Repo](https://github.com/leapwithluvi/portfolio) |
| **Portfolio V2 (Next.js + React)**| Current Core Personal Website | [GitHub Repo](https://github.com/leapwithluvi/portfolio-next) |
| **Digital Atelier** | Library Management System | [GitHub Repo](https://github.com/leapwithluvi/library-management-system) |
| **Nexus AI (This Repo)** | Conversational AI Platform | [GitHub Repo](https://github.com/leapwithluvi/ai-chatbot) |
| **Backend API Starter** | Express TypeScript Starter | [GitHub Repo](https://github.com/leapwithluvi/express-typescript-starter) |

---

## Contact

| Platform | Connectivity Type | Direct Link |
| :--- | :--- | :--- |
| **Email** | Professional Inquiries & Project Opportunities | [itsluvi13@gmail.com](mailto:itsluvi13@gmail.com) |
| **LinkedIn** | Career Updates & Professional Networking | [luviaprilyansyahgabriel](https://www.linkedin.com/in/luviaprilyansyahgabriel) |
| **GitHub** | Open Source Code & Active Contributions | [leapwithluvi](https://github.com/leapwithluvi) |
| **Instagram** | Personal Journey & Occasional Updates | [@byl.rooks](https://www.instagram.com/byl.rooks) |

---

## License

This project is licensed under the **MIT License** See the [LICENSE](LICENSE) file for more details.

---

## Let's Connect

I'm currently open to **Junior Developer opportunities**, freelance projects, and system collaborations. As a passionate **Fullstack Web Developer**, my core drive extends deep into the fields of **AI/ML**, **Data Science**, and **Data Engineering**. If you're looking for an engineer who loves building scalable backend-to-frontend systems alongside exploring bleeding-edge intelligence and analytics, let's talk!

> Built by **Luvi Aprilyansyah Gabriel** — Fullstack Web Developer | AI/ML, Data Science & Data Engineer Enthusiast
