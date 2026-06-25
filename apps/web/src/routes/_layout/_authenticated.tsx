import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { getSession } from "@/lib/auth-client"

export const Route = createFileRoute("/_layout/_authenticated")({
  beforeLoad: async ({ context }) => {
    const session = context.session ?? (await getSession()).data
    if (!session) {
      const pathName = new URL(location.href).pathname
      throw redirect({ to: "/auth", search: { redirect: pathName } })
    }
    return { user: session.user }
  },

  component: Outlet,
})
