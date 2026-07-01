import { createFileRoute } from "@tanstack/react-router"

import { useInterviewSession } from "@/api/queries/interview-sessions"

import { SessionAnswer } from "./-SessionAnswer"
import { SessionSummary } from "./-SessionSummary"

export const Route = createFileRoute("/_layout/_authenticated/mock-interview/sessions/$sessionId/")({
  component: RouteComponent,
})

function RouteComponent() {
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
            Mock interview for
          </h1>
          <h2 className="text-2xl leading-tight font-bold tracking-tight md:text-3xl lg:text-4xl">
            {position} @ {company}
          </h2>
          <p className="text-muted-foreground mt-4 text-xs whitespace-pre-line md:text-sm">
            Mode: <span className="text-primary uppercase">{config.mode}</span> · Difficulty:{" "}
            <span className="text-primary uppercase">{config.difficulty}</span> · Focus area:{" "}
            <span className="text-primary uppercase">{config.focusArea}</span>
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
