type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

type ApiInit = Omit<RequestInit, "method"> & { method?: HttpMethod }

export class ApiError extends Error {
  code: number
  constructor(code: number, message: string) {
    super(message)
    this.code = code
  }
}

export async function api<T>(path: string, init?: ApiInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    ...init,
  })
  if (!res.ok) {
    const body = await res.json()
    throw new ApiError(body.code, body.message)
  }
  return res.json()
}
