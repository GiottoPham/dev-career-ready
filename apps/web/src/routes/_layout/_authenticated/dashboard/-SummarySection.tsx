import { ArrowDownIcon, ArrowUpIcon } from "@phosphor-icons/react"

import type { StatsResponse } from "@/api/queries/stats"
import { cn } from "@/lib/utils"

export const SummarySection = ({ analysisCount, lastMonthAvg, sessionCompletedCount, thisMonthAvg }: StatsResponse) => {
  const compared = thisMonthAvg - lastMonthAvg

  return (
    <div className="border-border grid grid-cols-3 border">
      {[
        { value: analysisCount, label: "Analyses run" },
        { value: sessionCompletedCount, label: "Interviews completed" },
        {
          value: thisMonthAvg,
          label: "Avg score this month",
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
                  {Math.abs(compared)} pts
                </span>
                <span className="text-muted text-xs">vs last month</span>
              </div>
            ) : undefined,
        },
      ].map(({ value, label, subLabel }) => (
        <div className="border-border flex h-full w-full flex-col gap-y-2 border-r p-6 last:border-r-0" key={label}>
          <span className="text-primary text-5xl font-extrabold tabular-nums">{value}</span>
          <span className="text-muted-foreground text-sm">{label}</span>
          {subLabel}
        </div>
      ))}
    </div>
  )
}
