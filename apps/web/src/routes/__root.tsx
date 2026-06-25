import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import type { Session } from "@/lib/auth-client"

export interface RouterContext {
  session: Session | null
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </>
    )
  },
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    )
  },
})
