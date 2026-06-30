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
        "hover:border-primary border-border flex min-w-fit flex-col gap-y-2 border p-4 hover:cursor-pointer",
        {
          "border-primary": isSelected,
        }
      )}
    >
      <span className="text-primary text-sm">{title}</span>
      <p className="text-muted-foreground text-xs">
        <span className="text-primary font-bold">{matcheds}</span> matcheds ·{" "}
        <span className="text-primary font-bold">{gaps}</span> gaps
      </p>
      <span className="text-muted text-xs font-semibold">{format(createdAt, "dd MMM, yyyy")}</span>
    </button>
  )
}
