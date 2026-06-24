import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSafeRedirectPath(path?: string, fallback = "/analyze"): string {
  if (typeof path === "string" && path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\")) {
    return path
  }
  return fallback
}
