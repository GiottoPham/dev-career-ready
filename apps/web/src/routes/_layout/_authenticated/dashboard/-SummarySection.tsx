import { ArrowDownIcon, ArrowUpIcon } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next"

import { useStats } from "@/api/queries/stats"
import { cn } from "@/lib/utils"

export const SummarySection = () => {
  const { t } = useTranslation()
  const { data: stats, isPending } = useStats()

  if (isPending) {
    return (
      <div className="border-border flex flex-col border md:grid md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border-border flex h-full w-full flex-col items-center justify-center gap-y-2 border-b p-6 last:border-r-0 last:border-b-0 md:justify-start md:border-r"
          >
            <div className="bg-muted/10 h-10 w-16 animate-pulse" />
            <div className="bg-muted/10 h-3 w-24 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {return null}

  const { analysisCount, lastMonthAvg, sessionCompletedCount, thisMonthAvg } = stats
  const compared = thisMonthAvg - lastMonthAvg

  return (
    <div className="border-border flex flex-col border md:grid md:grid-cols-3">
      {[
        { value: analysisCount, label: t("dashboard.summary.analysesRun") },
        { value: sessionCompletedCount, label: t("dashboard.summary.interviewsCompleted") },
        {
          value: thisMonthAvg,
          label: t("dashboard.summary.avgScoreThisMonth"),
          subLabel:
            compared !== 0 ? (
              <div className="flex flex-row items-center gap-x-1.5">
                {compared < 0 ? (
                  <ArrowDownIcon className="h-3 w-3 text-red-500" weight="bold" />
                ) : (
                  <ArrowUpIcon className="text-primary h-3 w-3" weight="bold" />
                )}
                <span
                  className={cn("text-xs", {
                    "text-primary": compared > 0,
                    "text-red-500": compared < 0,
                  })}
                >
                  {Math.abs(compared)} {t("dashboard.summary.pts")}
                </span>
                <span className="text-muted text-xs">{t("dashboard.summary.vsLastMonth")}</span>
              </div>
            ) : undefined,
        },
      ].map(({ value, label, subLabel }) => (
        <div
          className="border-border flex h-full w-full flex-col items-center justify-center gap-y-2 border-b p-6 last:border-r-0 last:border-b-0 md:justify-start md:border-r"
          key={label}
        >
          <span className="text-primary text-5xl font-extrabold tabular-nums">{value}</span>
          <span className="text-muted-foreground text-sm">{label}</span>
          {subLabel}
        </div>
      ))}
    </div>
  )
}
