import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nexusai.my.id"),
  title: {
    default: "Nexus AI — Advanced Fullstack AI Chatbot Platform",
    template: "%s | Nexus AI",
  },
  description:
    "Nexus Neural Orchestrator is a modern, high-performance Fullstack AI Chatbot with real-time streaming, secure OAuth, and relational database architecture. Built with Next.js, Hono, Drizzle ORM, and Groq LPU Engine.",
  keywords: [
    "AI chatbot",
    "Nexus AI",
    "fullstack chatbot",
    "real-time AI streaming",
    "Groq LPU",
    "Next.js AI",
    "Hono framework",
    "Drizzle ORM",
    "server-sent events",
    "portfolio project",
    "Luvi Aprilyansyah Gabriel",
  ],
  authors: [{ name: "Luvi Aprilyansyah Gabriel", url: "https://github.com/leapwithluvi" }],
  creator: "Luvi Aprilyansyah Gabriel",
  publisher: "Nexus Systems Protocol",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexusai.my.id",
    siteName: "Nexus AI",
    title: "Nexus AI — Advanced Fullstack AI Chatbot Platform",
    description:
      "High-performance AI chatbot with real-time SSE streaming, secure OAuth ecosystem, and relational database architecture. Powered by Groq LPU inference.",
    images: [
      {
        url: "/screenshot.png",
        width: 1200,
        height: 630,
        alt: "Nexus AI — Advanced Fullstack AI Chatbot Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus AI — Advanced Fullstack AI Chatbot Platform",
    description:
      "High-performance AI chatbot with real-time SSE streaming, secure OAuth ecosystem, and relational database architecture.",
    images: ["/screenshot.png"],
    creator: "@leapwithluvi",
  },
  alternates: {
    canonical: "https://nexusai.my.id",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <AppContextProvider>
              {children}
              <Toaster position="top-center" richColors theme="system" />
            </AppContextProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
