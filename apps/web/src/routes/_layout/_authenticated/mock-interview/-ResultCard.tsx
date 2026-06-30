import { ArrowRightIcon, CheckCircleIcon, CircleIcon } from "@phosphor-icons/react"
import { Link } from "@tanstack/react-router"
import { format } from "date-fns"
import { enUS, vi as viLocale } from "date-fns/locale"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"

type ResultCardProps = {
  id: number
  title: string
  matcheds: number
  gaps: number
  createdAt: Date
  onSelect: (id: number) => void
  isSelected?: boolean
}

export const ResultCard = ({ id, title, matcheds, gaps, createdAt, onSelect, isSelected }: ResultCardProps) => {
  const { t, i18n } = useTranslation()
  const dateLocale = i18n.language === "vn" ? viLocale : enUS

  return (
    <button
      onClick={() => onSelect(id)}
      className={cn(
        "hover:border-primary border-border relative flex min-w-fit flex-col items-start gap-y-2 border p-4 hover:cursor-pointer",
        {
          "border-primary": isSelected,
        }
      )}
    >
      <div className="absolute top-2 right-2">
        {isSelected ? (
          <CheckCircleIcon className="text-primary h-4 w-4" weight="fill" />
        ) : (
          <CircleIcon className="text-muted-foreground h-4 w-4" />
        )}
      </div>
      <span className="text-primary text-start text-sm">{title}</span>
      <p className="text-muted-foreground text-xs">
        <span className="text-primary font-bold">{matcheds}</span> {t("mockInterview.source.matched")} ·{" "}
        <span className="text-primary font-bold">{gaps}</span> {t("mockInterview.source.gaps")}
      </p>
      <div className="mt-auto flex w-full items-center justify-between">
        <span className="text-muted text-xs font-semibold">
          {format(createdAt, "dd MMM, yyyy", { locale: dateLocale })}
        </span>
        <div
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <Link
            to="/analyze/results/$resultId"
            params={{ resultId: `${id}` }}
            aria-label={t("mockInterview.source.viewDetail")}
          >
            <div className="border-muted hover:border-primary border-b">
              <span className="text-muted hover:text-primary flex items-center gap-1 text-xs">
                {t("mockInterview.source.viewDetail")}
                <ArrowRightIcon className="h-3 w-3" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </button>
  )
}
