import { createFileRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { useInterviewSession } from "@/api/queries/interview-sessions"

import { SessionAnswer } from "./-SessionAnswer"
import { SessionSummary } from "./-SessionSummary"

export const Route = createFileRoute("/_layout/_authenticated/mock-interview/sessions/$sessionId/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { sessionId } = Route.useParams()
  const { data: session, refetch: refetchSession } = useInterviewSession({ sessionId: Number(sessionId) })

  if (!session) {
    return null
  }

  const { company, position, config, status } = session

  return (
    <div className="h-full">
      <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-muted-foreground mb-4 text-base font-bold tracking-widest uppercase md:text-lg">
            {t("mockInterview.session.heading")}
          </h1>
          <h2 className="text-2xl leading-tight font-bold tracking-tight md:text-3xl lg:text-4xl">
            {position} @ {company}
          </h2>
          <p className="text-muted-foreground mt-4 text-xs whitespace-pre-line md:text-sm">
            {t("mockInterview.session.mode")}:{" "}
            <span className="text-primary">{t(`mockInterview.settings.modes.${config.mode}`)}</span> ·{" "}
            {t("mockInterview.session.difficulty")}:{" "}
            <span className="text-primary">{t(`mockInterview.settings.difficulties.${config.difficulty}`)}</span> ·{" "}
            {t("mockInterview.session.focusArea")}:{" "}
            <span className="text-primary">{t(`mockInterview.settings.focusAreas.${config.focusArea}`)}</span>
          </p>
        </div>
      </section>
      <div className="px-4 pb-20 md:px-6 md:pb-32">
        <div className="mx-auto max-w-5xl">
          {status === "active" && (
            <SessionAnswer
              session={session}
              onAnswer={async () => {
                await refetchSession()
              }}
            />
          )}
          {status === "completed" && <SessionSummary session={session} />}
        </div>
      </div>
    </div>
  )
}
