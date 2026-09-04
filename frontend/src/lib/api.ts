/**
 * Centralized API client configuration.
 * All backend fetch calls must use these helpers to ensure the base URL
 * is resolved from the environment variable and never hardcoded.
 *
 * Usage:
 *   import { apiUrl, apiFetch } from "@/lib/api";
 *
 *   // Just build a URL string:
 *   const url = apiUrl("/auth/me");
 *
 *   // Or make a full fetch with credentials already included:
 *   const res = await apiFetch("/auth/me");
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3001";

/**
 * Build an absolute URL to the backend API.
 * @param path - The API path, e.g. "/api/v1/auth/me"
 */
export const apiUrl = (path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${normalizedPath}`;
};

/**
 * Fetch wrapper that automatically:
 *  - Points to the correct backend URL (from env)
 *  - Sends cookies (credentials: "include") for httpOnly session auth
 *  - Accepts an optional RequestInit to override/extend defaults
 */
export const apiFetch = async (path: string, init?: RequestInit): Promise<Response> => {
  const response = await fetch(apiUrl(path), {
    credentials: "include",
    ...init,
    headers: {
      ...(init?.headers ?? {}),
    },
  });

  // Global Session Manager: Automatically redirect to login if session expires
  if (response.status === 401 && typeof window !== "undefined") {
    // Only redirect if we are not already on the login page or trying to fetch session
    if (window.location.pathname !== "/login" && !path.includes("/auth/session") && !path.includes("/auth/logout")) {
      window.location.href = `/login?login=error&reason=expired`;
    }
  }

  return response;
};
