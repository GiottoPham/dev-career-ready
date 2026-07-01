import type { InterviewSession } from "@packages/shared"
import { CaretRightIcon, CheckIcon, WarningIcon } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next"

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
      <div className="border-border border">
        <div className="border-border border-b p-4">
          <span className="text-muted-foreground flex flex-row items-center gap-x-2 text-sm">
            <CaretRightIcon className="text-primary h-4 w-4" weight="bold" />
            <span className="font-bold">{t("mockInterview.session.summary.score")}</span>
          </span>
        </div>
        <div className="flex min-h-48 items-center justify-center p-8 text-center">
          <div>
            <p className="text-primary text-6xl font-bold tabular-nums">{score}</p>
            <p className="text-muted-foreground mt-1 text-xs tracking-widest uppercase">{t("mockInterview.session.summary.outOf")}</p>
          </div>
        </div>
      </div>

      <div className="border-border border">
        <div className="border-border border-b p-4">
          <span className="text-muted-foreground flex flex-row items-center gap-x-2 text-sm">
            <CaretRightIcon className="text-primary h-4 w-4" weight="bold" />
            <span className="font-bold">{t("mockInterview.session.summary.feedback")}</span>
          </span>
        </div>
        <div className="p-4">
          <p className="text-xs leading-loose">{feedback}</p>
        </div>
      </div>

      <div className="border-border border">
        <div className="border-border border-b p-4">
          <span className="text-muted-foreground flex flex-row items-center gap-x-2 text-sm">
            <CaretRightIcon className="text-primary h-4 w-4" weight="bold" />
            <span className="font-bold">{t("mockInterview.session.summary.strengths")}</span>
          </span>
        </div>
        <div className="flex flex-col gap-y-2 p-4">
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
        </div>
      </div>

      <div className="border-border border">
        <div className="border-border border-b p-4">
          <span className="text-muted-foreground flex flex-row items-center gap-x-2 text-sm">
            <CaretRightIcon className="text-primary h-4 w-4" weight="bold" />
            <span className="font-bold">{t("mockInterview.session.summary.improvements")}</span>
          </span>
        </div>
        <div className="flex flex-col gap-y-2 p-4">
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
        </div>
      </div>

      {turns.length > 0 && (
        <div className="border-border border">
          <div className="border-border border-b p-4">
            <span className="text-muted-foreground flex flex-row items-center gap-x-2 text-sm">
              <CaretRightIcon className="text-primary h-4 w-4" weight="bold" />
              <span className="font-bold">{t("mockInterview.session.summary.transcript")}</span>
            </span>
          </div>
          <div className="flex flex-col gap-y-2 p-4">
            {turns.map(({ question, turnIndex, userAnswer }, idx) => (
              <div
                key={turnIndex}
                className={cn("border-border border-b pb-4", {
                  "border-none pb-0": idx === turns.length - 1,
                })}
              >
                <p className="text-primary mb-1 text-xs font-bold">{t("mockInterview.session.questionLabel", { n: turnIndex + 1 })}</p>
                <p className="mb-2 text-xs leading-relaxed font-medium">{question}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{userAnswer ?? "—"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
