import { Link } from "@tanstack/react-router"
import { format } from "date-fns"

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
      <span className="text-primary text-start text-sm">{title}</span>
      <p className="text-muted-foreground text-xs">
        <span className="text-primary font-bold">{matcheds}</span> matcheds ·{" "}
        <span className="text-primary font-bold">{gaps}</span> gaps
      </p>
      <div className="flex w-full items-center justify-between">
        <span className="text-muted text-xs font-semibold">{format(createdAt, "dd MMM, yyyy")}</span>
        <div
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <Link to="/analyze/results/$resultId" params={{ resultId: `${id}` }} aria-label="View analysis result">
            <span className="text-muted hover:text-primary flex items-center gap-1 text-xs underline">View result</span>
          </Link>
        </div>
      </div>
    </button>
  )
}
