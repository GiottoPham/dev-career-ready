import type { InterviewSession } from "@packages/shared"
import { ArrowRightIcon, CheckIcon, WarningIcon } from "@phosphor-icons/react"
import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { buttonVariants } from "@/components/ui/button"
import { SectionPanel } from "@/components/ui/section-panel"
import { cn } from "@/lib/utils"

type SessionSummaryProps = {
  session: InterviewSession
}

export const SessionSummary = ({ session }: SessionSummaryProps) => {
  const { t } = useTranslation()
  const summary = session.summary
  const turns = session.turns

  if (!summary) return null

  const { score, feedback, strengths, improvements } = summary

  return (
    <div className="flex flex-col gap-y-8">
      <SectionPanel title={t("mockInterview.session.summary.score")} bodyClassName="flex min-h-48 items-center justify-center p-8! text-center">
        <div>
          <p className="text-primary text-6xl font-bold tabular-nums">{score}</p>
          <p className="text-muted-foreground mt-1 text-xs tracking-widest uppercase">
            {t("mockInterview.session.summary.outOf")}
          </p>
        </div>
      </SectionPanel>

      <SectionPanel title={t("mockInterview.session.summary.feedback")}>
        <p className="text-xs leading-loose">{feedback}</p>
      </SectionPanel>

      <SectionPanel title={t("mockInterview.session.summary.strengths")} bodyClassName="flex flex-col gap-y-2">
        {strengths.map((strength, idx) => (
          <div
            key={strength}
            className={cn("border-border flex flex-row items-start border-b pb-4", {
              "border-none pb-0": idx === strengths.length - 1,
            })}
          >
            <div className="min-w-6">
              <CheckIcon className="text-primary mt-0.5 h-3 w-3" />
            </div>
            <span className="text-xs">{strength}</span>
          </div>
        ))}
      </SectionPanel>

      <SectionPanel title={t("mockInterview.session.summary.improvements")} bodyClassName="flex flex-col gap-y-2">
        {improvements.map((improvement, idx) => (
          <div
            key={`${improvement}_${idx}`}
            className={cn("border-border flex flex-row items-start border-b pb-4", {
              "border-none pb-0": idx === improvements.length - 1,
            })}
          >
            <div className="mt-1 min-w-6">
              <WarningIcon className="mt-0.5 h-3 w-3" />
            </div>
            <span className="text-xs leading-loose">{improvement}</span>
          </div>
        ))}
      </SectionPanel>

      {turns.length > 0 && (
        <SectionPanel title={t("mockInterview.session.summary.transcript")} bodyClassName="flex flex-col gap-y-2">
          {turns.map(({ question, turnIndex, userAnswer }, idx) => (
            <div
              key={turnIndex}
              className={cn("border-border border-b pb-4", {
                "border-none pb-0": idx === turns.length - 1,
              })}
            >
              <p className="text-primary mb-1 text-xs font-bold">
                {t("mockInterview.session.questionLabel", { n: turnIndex + 1 })}
              </p>
              <p className="mb-2 text-xs leading-relaxed font-medium">{question}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{userAnswer ?? "—"}</p>
            </div>
          ))}
        </SectionPanel>
      )}

      <div className="flex flex-row items-center justify-end">
        <Link to="/mock-interview" className={cn(buttonVariants({ size: "lg" }))}>
          {t("mockInterview.session.summary.newSession")}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
