import { createFileRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { useSession } from "@/lib/auth-client"

import { AnalysisSection } from "./-AnalysisSection"
import { SessionsSection } from "./-SessionsSection"
import { SummarySection } from "./-SummarySection"

export const Route = createFileRoute("/_layout/_authenticated/dashboard/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { data } = useSession()

  return (
    <div className="h-full">
      <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-muted-foreground mb-4 text-base font-bold tracking-widest uppercase md:text-lg">
            {t("dashboard.hero.label")}
          </h1>
          <h2 className="text-2xl leading-tight font-bold tracking-tight md:text-3xl lg:text-4xl">
            {t("dashboard.hero.welcome")} <span className="text-primary">{data?.user.name}</span>.
          </h2>
          <p className="text-muted-foreground mt-4 text-xs whitespace-pre-line md:text-sm">
            {t("dashboard.hero.subtitle")}
          </p>
        </div>
      </section>
      <section className="px-4 pb-20 md:px-6 md:pb-32">
        <div className="mx-auto flex max-w-5xl flex-col gap-y-8">
          <SummarySection />
          <AnalysisSection />
          <SessionsSection />
        </div>
      </section>
    </div>
  )
}
