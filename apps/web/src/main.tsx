import { RouterProvider, createRouter } from "@tanstack/react-router"
import ReactDOM from "react-dom/client"

import "./index.css"

import { useSession } from "./lib/auth-client"
import type { RouterContext } from "./routes/__root"
import { routeTree } from "./routeTree.gen"

import "./i18n"

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultStaleTime: 5000,
  scrollRestoration: true,
  context: { session: null } satisfies RouterContext,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

export const App = () => {
  const { data: session, isPending } = useSession()
  if (isPending) return null
  return <RouterProvider router={router} context={{ session: session ?? null }} />
}

const rootElement = document.getElementById("app")!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<App />)
}
