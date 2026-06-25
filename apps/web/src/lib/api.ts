const API_URL = import.meta.env.VITE_API_URL

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

type ApiInit = Omit<RequestInit, "method"> & { method?: HttpMethod }

export async function api<T>(path: string, init?: ApiInit): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    credentials: "include",
    ...init,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
