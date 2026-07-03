import type { Language, ResultResponse } from "@packages/shared"
import { ArrowRightIcon, ChartBarIcon } from "@phosphor-icons/react"
import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { useAllResults } from "@/api/queries/results"
import { DataPagination } from "@/components/ui/data-pagination"
import { SectionPanel } from "@/components/ui/section-panel"
import { formatRelative } from "@/lib/date"
import { cn } from "@/lib/utils"

const AnalysisCard = ({ company, position, createdAt, missingSkills, matchedSkills, id }: ResultResponse) => {
  const { i18n } = useTranslation()

  return (
    <Link
      to="/analyze/results/$resultId"
      params={{ resultId: `${id}` }}
      className="border-border group hover:border-l-primary flex flex-col gap-y-1.5 border-b border-l-2 border-l-transparent p-4 transition-colors"
    >
      <div className="flex flex-col gap-y-0.5 md:flex-row md:items-center md:justify-between md:gap-x-4">
        <p className="text-sm font-bold">
          <span className="text-primary">{position}</span>
          <span className="text-foreground"> @ {company}</span>
        </p>
        <span className="text-muted hidden shrink-0 text-xs md:block">
          {formatRelative(createdAt, i18n.language as Language)}
        </span>
      </div>
      <div className="flex flex-row items-center justify-between">
        <p className="text-muted-foreground text-xs">
          <span className="text-primary font-bold">{matchedSkills.length}</span> matched ·{" "}
          <span className="text-destructive font-bold">{missingSkills.length}</span> missing
        </p>
        <span className="text-primary hidden items-center gap-x-1 text-xs font-medium transition-opacity md:flex md:opacity-0 md:group-hover:opacity-100">
          View <ArrowRightIcon className="h-3 w-3" weight="bold" />
        </span>
      </div>
      <div className="flex items-center justify-between gap-x-2 md:hidden">
        <span className="text-muted shrink-0 text-xs">{formatRelative(createdAt, i18n.language as Language)}</span>
        <span className="text-primary flex items-center gap-x-1 text-xs font-medium underline transition-opacity md:opacity-0 md:group-hover:opacity-100">
          View
        </span>
      </div>
    </Link>
  )
}

const LIMIT = 5

export const AnalysisSection = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: results, isFetching } = useAllResults({ limit: LIMIT, page: currentPage })

  if (!results) return null

  return (
    <SectionPanel
      title="Recent Analyses"
      icon={<ChartBarIcon className="h-4 w-4" weight="bold" />}
      bodyClassName={cn("flex flex-col p-0", { "opacity-50 pointer-events-none": isFetching })}
    >
      {results.data.map((result) => (
        <AnalysisCard {...result} key={result.id} />
      ))}
      <div className="p-4">
        <DataPagination
          renderShowing={(from, to, total) => `Showing ${from} - ${to} of ${total}`}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          {...results}
        />
      </div>
    </SectionPanel>
  )
}
