import { createFileRoute, Outlet } from "@tanstack/react-router"
import { redirect } from "@tanstack/router-core"

export const Route = createFileRoute("/_layout/Route")({
  beforeLoad: async () => {
    const { data: session } = await getSession()
    if (!session) {
      throw redirect({ to: "/login" })
    }
    return { user: session.user }
  },
  component: Outlet,
})
