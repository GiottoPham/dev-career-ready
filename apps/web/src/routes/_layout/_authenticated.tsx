import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/_authenticated")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  beforeLoad: async ({ context, location }) => {
    const session = context.session
    if (!session) {
      throw redirect({ to: "/auth", search: { redirect: location.pathname } })
    }
    return { user: session.user }
  },

  component: Outlet,
})
