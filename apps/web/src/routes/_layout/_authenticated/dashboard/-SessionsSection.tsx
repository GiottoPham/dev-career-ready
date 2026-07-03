import type { Language } from "@packages/shared"
import { ArrowRightIcon, MicrophoneIcon } from "@phosphor-icons/react"
import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { useAllInterviewSession, type InterviewSessionQuery } from "@/api/queries/interview-sessions"
import { DataPagination } from "@/components/ui/data-pagination"
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { SectionPanel } from "@/components/ui/section-panel"
import { formatRelative } from "@/lib/date"
import { cn } from "@/lib/utils"

const InterviewSessionCard = ({
  company,
  position,
  createdAt,
  status,
  id,
  completedAt,
  summary,
  config: { difficulty, focusArea, questionCount, mode },
}: InterviewSessionQuery) => {
  const { i18n, t } = useTranslation()

  const durationMs = completedAt ? new Date(completedAt).getTime() - new Date(createdAt).getTime() : 0
  const minutes = Math.floor(durationMs / 60000)
  const seconds = Math.floor((durationMs % 60000) / 1000)

  return (
    <Link
      to="/mock-interview/sessions/$sessionId"
      params={{ sessionId: `${id}` }}
      className="border-border group hover:border-l-primary flex flex-col items-stretch border-b border-l-2 border-l-transparent transition-colors md:flex-row"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-y-2 p-4">
        <div className="flex flex-col gap-y-0.5 md:flex-row md:items-center md:justify-between md:gap-x-4">
          <p className="text-foreground text-sm font-bold">
            {position} <span className="text-muted-foreground font-normal">@ {company}</span>
          </p>
          <span className="text-muted hidden shrink-0 text-xs md:block">
            {formatRelative(createdAt, i18n.language as Language)}
          </span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <p className="text-muted-foreground text-xs tracking-widest uppercase">
            {[
              t(`mockInterview.settings.modes.${mode}`),
              t(`mockInterview.settings.difficulties.${difficulty}`),
              t(`mockInterview.settings.focusAreas.${focusArea}`),
              `${questionCount} Q`,
              completedAt ? `${minutes}m ${seconds}s` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <span className="text-primary hidden items-center gap-x-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100 md:flex">
            {status === "active" ? "Continue" : "Review"} <ArrowRightIcon className="h-3 w-3" weight="bold" />
          </span>
        </div>
        {summary?.score && (
          <div className="block md:hidden">
            <Field className="w-full max-w-sm">
              <FieldLabel htmlFor="score">
                <span>Score</span>
                <span className="ml-auto">{summary.score}</span>
              </FieldLabel>
              <Progress value={summary.score} id="score" />
            </Field>
          </div>
        )}
        <div className="flex flex-row items-center justify-between md:hidden">
          <span className="text-muted shrink-0 text-xs">{formatRelative(createdAt, i18n.language as Language)}</span>
          <span className="text-primary text-xs font-medium underline">
            {status === "active" ? "Continue" : "Review"}
          </span>
        </div>
      </div>
      <div
        className={cn(
          "border-border hidden w-full shrink-0 flex-col items-center justify-center border-t p-4 md:flex md:w-16 md:border-l",
          !!summary?.score && "bg-primary/5"
        )}
      >
        {summary?.score ? (
          <>
            <span className="text-primary text-lg leading-none font-bold tabular-nums">{summary.score}</span>
            <span className="text-muted-foreground text-[10px]">/100</span>
          </>
        ) : (
          <span className="text-muted text-[10px] tracking-widest uppercase">{status === "active" ? "live" : "—"}</span>
        )}
      </div>
    </Link>
  )
}

const LIMIT = 5

export const SessionsSection = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: sessions, isFetching } = useAllInterviewSession({ limit: LIMIT, page: currentPage })

  if (!sessions) return null

  return (
    <SectionPanel
      title="Mock Interview History"
      icon={<MicrophoneIcon className="h-4 w-4" weight="bold" />}
      bodyClassName={cn("flex flex-col p-0", { "opacity-50 pointer-events-none": isFetching })}
    >
      {sessions.data.map((session) => (
        <InterviewSessionCard {...session} key={session.id} />
      ))}
      <div className="p-4">
        <DataPagination
          renderShowing={(from, to, total) => `Showing ${from} - ${to} of ${total}`}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          {...sessions}
        />
      </div>
    </SectionPanel>
  )
}
