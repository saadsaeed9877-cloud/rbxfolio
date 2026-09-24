import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getApiUrl(path: string) {
  const base =
    typeof window !== "undefined"
      ? "/api/v1"
      : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getMediaUrl(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
    const apiOrigin = new URL(apiBase).origin;
    return `${apiOrigin}${url}`;
  } catch {
    // If URL parsing fails, return the url as-is (fallback)
    return url;
  }
}

export function formatRole(role: string) {
  return role
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}
