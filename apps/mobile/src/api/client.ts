import { authClient } from "../lib/auth-client"

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

type ApiInit = Omit<RequestInit, "method"> & { method?: HttpMethod }

export class ApiError extends Error {
  code: number
  constructor(code: number, message: string) {
    super(message)
    this.code = code
  }
}

const API_URL = process.env.EXPO_PUBLIC_API_URL

export async function api<T>(path: string, init?: ApiInit): Promise<T> {
  const cookie = authClient.getCookie()
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "omit",
    headers: { ...init?.headers, ...(cookie ? { Cookie: cookie } : {}) },
  })
  if (!res.ok) {
    const body = await res.json()
    throw new ApiError(body.code, body.message)
  }
  return res.json()
}
