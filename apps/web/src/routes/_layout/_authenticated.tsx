import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { getSession } from "@/lib/auth-client"

export const Route = createFileRoute("/_layout/_authenticated")({
  beforeLoad: async () => {
    const { data: session } = await getSession()
    if (!session) {
      throw redirect({ to: "/auth" })
    }
    return { user: session.user }
  },
  component: Outlet,
})
