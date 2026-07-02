import { createFileRoute } from "@tanstack/react-router"

import { useStats } from "@/api/queries/stats"
import { useSession } from "@/lib/auth-client"

import { SummarySection } from "./-SummarySection"

export const Route = createFileRoute("/_layout/_authenticated/dashboard/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useSession()

  const { data: stats } = useStats()

  return (
    <div className="h-full">
      <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-muted-foreground mb-4 text-base font-bold tracking-widest uppercase md:text-lg">
            Dashboard
          </h1>
          <h2 className="text-2xl leading-tight font-bold tracking-tight md:text-3xl lg:text-4xl">
            Welcome back, <span className="text-primary">{data?.user.name}</span>.
          </h2>
          <p className="text-muted-foreground mt-4 text-xs whitespace-pre-line md:text-sm">
            Here&apos;s where you left off.
          </p>
        </div>
      </section>
      <section className="px-4 md:px-6">
        <div className="mx-auto max-w-5xl">{stats ? <SummarySection {...stats} /> : <div />}</div>
      </section>
    </div>
  )
}
