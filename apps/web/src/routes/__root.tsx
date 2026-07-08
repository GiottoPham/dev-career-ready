import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { HeadContent, Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import { Toaster } from "@/components/ui/sonner"
import type { Session } from "@/lib/auth-client"

export interface RouterContext {
  session: Session | null
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { title: "CareerReady — Know Your Skill Gaps, Practice Mock Interviews" },
      {
        name: "description",
        content:
          "Paste a job description and upload your CV. AI analyzes your skills against the JD and generates mock interview questions covering all required skills.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: () => {
    return (
      <>
        <HeadContent />
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Toaster />
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
