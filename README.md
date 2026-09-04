# 🌟 Nexus Neural Orchestrator — Fullstack AI Chatbot

<!-- GitHub badges -->
[![Stars](https://img.shields.io/github/stars/leapwithluvi/nexus-neural-orchestrator?style=social)](https://github.com/leapwithluvi/nexus-neural-orchestrator/stargazers)
[![Fork](https://img.shields.io/github/forks/leapwithluvi/nexus-neural-orchestrator?style=social)](https://github.com/leapwithluvi/nexus-neural-orchestrator/forks)
[![GitHub commits](https://img.shields.io/github/commit-activity/t/leapwithluvi/nexus-neural-orchestrator?style=social&logo=github)](https://github.com/leapwithluvi/nexus-neural-orchestrator/commits)
[![Pull requests](https://img.shields.io/github/issues-pr/leapwithluvi/nexus-neural-orchestrator?style=social&logo=github)](https://github.com/leapwithluvi/nexus-neural-orchestrator/pulls)

![Nexus AI Showcase](./frontend/public/og-image.jpeg)

[![leapwithluvi](https://custom-icon-badges.demolab.com/badge/made%20by%20-leapwithluvi-556bf2?logo=github&logoColor=white&labelColor=101827)](https://github.com/leapwithluvi)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?color=dddddd&labelColor=000000)](https://github.com/leapwithluvi/nexus-neural-orchestrator/blob/main/LICENSE)
[![Top Language](https://img.shields.io/github/languages/top/leapwithluvi/nexus-neural-orchestrator?logo=github&logoColor=%23007ACC&label=TypeScript)](https://www.typescriptlang.org/)
![PRs](https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=shields)
![Status](https://img.shields.io/badge/Status-Active-success)
![Vercel](https://img.shields.io/badge/Vercel-Deployment--Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 🖥️ Live Preview

👉 **[Visit Nexus AI Live → nexusai.my.id](https://www.nexusai.my.id)**

## 🚀 One-Click Deploy

If you like this system architecture, feel free to deploy your own version for **FREE**! (Requires Supabase/Neon & Groq API setup).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fleapwithluvi%2Fnexus-neural-orchestrator)

*Don't forget to give a ⭐ if you find this portfolio project inspiring!*

## 📖 Table of Contents

<details><summary>Table of Contents</summary>

- [Description](#-description)
- [Key Features](#-key-features)
- [Folder Structure](#-folder-structure)
- [Technologies Used](#-technologies-used)
- [Get Started](#-get-started)
- [Featured Projects](#-featured-projects)
- [Contact](#-contact)
- [License](#-license)

</details>

## 📝 Description

**Nexus Neural Orchestrator** is a modern, high-performance **Fullstack AI Chatbot** built as a showcase of advanced full-stack development capabilities. 

Combining the raw speed of **Next.js 16** on the client with the lightweight efficiency of **Hono & Bun** on the backend, this platform delivers incredibly fast AI responses powered by the **Groq Inference Engine**. It leverages **Drizzle ORM** with **Neon Postgres** for robust, serverless database management, wrapped in a premium, minimalist UI styled with **Tailwind CSS 4.0** and **Shadcn UI**.

## ✨ Key Features

- **🎨 Premium Interface**: Sleek, immersive dark mode UI with interactive Sidebar, micro-animations, and glassmorphism.
- **⚡ Ultra-Fast AI Streaming**: Implements real-time Server-Sent Events (SSE) combined with Groq LLM for blink-of-an-eye response times.
- **🔐 Secure OAuth Authentication**: Frictionless login via GitHub and Google integrated deep into the backend APIs.
- **💾 Relational Database**: Chat history and user identities securely managed through **Neon Postgres** and **Drizzle ORM**.
- **🛡️ Monorepo Architecture**: Clean separation of concerns between `frontend/` and `backend/` for optimal maintainability.
- **🌐 Seamless UX**: Dynamic URL synchronization, state management, and intuitive navigation states.

## 📂 Folder Structure

<details><summary><b>Project Layout</b></summary>

```bash
nexus-neural-orchestrator/
├── frontend/             # Next.js 16 Client Application
│   ├── src/app/          # App Router Pages (Chat, Overview, Auth, Settings)
│   ├── src/components/   # Modular React Components (Shadcn UI, Sidebar)
│   ├── src/context/      # React Context (State Management & API integration)
│   └── src/data/         # Static Data configurations
└── backend/              # Hono + Bun API Server
    ├── src/controllers/  # Business logic and Route Handlers
    ├── src/db/           # Drizzle ORM schemas and db connections
    ├── src/middlewares/  # JWT validation, error handling, auth checks
    └── src/routes/       # API Endpoint Definitions
```

</details>

## ✨ Technologies Used

<details><summary>Built with a cutting-edge high-performance stack:</summary>

- **Frontend:**
  - [Next.js 16](https://nextjs.org/) / React 19: The industry standard for production React apps.
  - [Tailwind CSS 4.0](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/): Rapid, beautiful component styling.
  - [Lucide React](https://lucide.dev/): Simple, professional vector icons.
- **Backend & Data:**
  - [Bun](https://bun.sh/) & [Hono](https://hono.dev/): Ultra-fast JS runtime and web framework.
  - [Drizzle ORM](https://orm.drizzle.team/): Type-safe SQL mapper.
  - [Neon Serverless Postgres](https://neon.tech/): Modern, cloud-native PostgreSQL.
- **AI Integration:**
  - [Groq API](https://groq.com/): Blazing-fast inference engine driving the LLM responses.

</details><br/>

[![Technologies Used](https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,bun,postgres,vercel)](https://skillicons.dev)

## 🧰 Get Started

You will need a `.env` file in both `frontend` and `backend` directories containing your Groq API keys, Neon DB URL, and OAuth details.

```bash
# Clone the repository
git clone https://github.com/leapwithluvi/nexus-neural-orchestrator.git
cd nexus-neural-orchestrator

# --- Terminal 1: Backend ---
cd backend
npm install
npm run dev

# --- Terminal 2: Frontend ---
cd frontend
npm install
npm run dev
```

## 🚀 Featured Projects

- 🔗 [Portfolio V1 (Vite + React) - Personal Website](https://github.com/leapwithluvi/portfolio)
- 🔗 [Portfolio V2 (Next.js + React) - Personal Website](https://github.com/leapwithluvi/portfolio-next)
- 🔗 [Library Management System](https://github.com/leapwithluvi/library-management-system)
- 🔗 [Conversational AI Platform](https://github.com/leapwithluvi/ai-chatbot)
- 🔗 [Express TypeScript Starter](https://github.com/leapwithluvi/express-typescript-starter)

---

## 📬 Contact

| Platform | Link |
| :--- | :--- |
| 📧 Email | [itsluvi13@gmail.com](mailto:itsluvi13@gmail.com) |
| 💼 LinkedIn | [luviaprilyansyahgabriel](https://www.linkedin.com/in/luviaprilyansyahgabriel) |
| 🐙 GitHub | [leapwithluvi](https://github.com/leapwithluvi) |
| 📸 Instagram | [@byl.rooks](https://www.instagram.com/byl.rooks) |

---

## 📋 License

This project is licensed under the **MIT License** See the [LICENSE](LICENSE) file for more details.

---

## 🚀 Let's Connect

I'm currently open to **Junior Developer opportunities**, freelance projects, and AI/ML collaborations. If you're looking for a passionate Fullstack Web Developer who loves building scalable and beautiful products, let's talk!

> Built with by **Luvi Aprilyansyah Gabriel** — Fullstack Web Developer & AI/ML Enthusiast
