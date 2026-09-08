import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Nexus AI",
  description:
    "Sign in to Nexus AI using your GitHub or Google account. Secure OAuth authentication with HTTP-only cookie sessions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
