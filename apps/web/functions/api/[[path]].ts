interface Env {
  RAILWAY_API_URL: string
}

interface EventContext {
  request: Request
  env: Env
  params: Record<string, string | string[]>
  waitUntil: (promise: Promise<unknown>) => void
  passThroughOnException: () => void
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>
}

export const onRequest = async (context: EventContext): Promise<Response> => {
  const url = new URL(context.request.url)
  const target = new URL(url.pathname + url.search, context.env.RAILWAY_API_URL)

  const request = new Request(target.toString(), {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
    // Pass 302/301 responses through to browser instead of following them.
    // This preserves Set-Cookie headers on the OAuth callback redirect.
    redirect: "manual",
    // @ts-expect-error — duplex is required by spec when body is a ReadableStream
    duplex: "half",
  })

  const response = await fetch(request)

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  })
}
