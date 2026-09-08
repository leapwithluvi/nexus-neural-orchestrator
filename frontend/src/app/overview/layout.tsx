import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview — Nexus Neural Orchestrator",
  description:
    "Explore Nexus AI: a modern fullstack AI chatbot platform with real-time streaming, secure OAuth, glassmorphism UI, and high-performance Groq LPU inference. Built as a portfolio project by Luvi Aprilyansyah Gabriel.",
  openGraph: {
    title: "Overview — Nexus Neural Orchestrator",
    description:
      "Discover a high-integrity AI chatbot platform built on Next.js, Hono, Drizzle ORM, and Groq LPU. Featuring blazing fast streaming, secure OAuth, and a sleek glassmorphism interface.",
    url: "https://nexusai.my.id/overview",
  },
  alternates: {
    canonical: "https://nexusai.my.id/overview",
  },
};

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
