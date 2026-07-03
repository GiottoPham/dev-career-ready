import { CaretRightIcon } from "@phosphor-icons/react"
import type { HTMLAttributes, ReactNode } from "react"

import { cn } from "@/lib/utils"

type SectionPanelProps = {
  title: string
  children: ReactNode
  description?: string
  icon?: ReactNode
  className?: HTMLAttributes<HTMLDivElement>["className"]
  bodyClassName?: HTMLAttributes<HTMLDivElement>["className"]
  variant?: "sm" | "xs"
}

export const SectionPanel = ({
  title,
  children,
  description,
  icon,
  className,
  bodyClassName,
  variant = "sm",
}: SectionPanelProps) => (
  <div className={cn("border-border border", className)}>
    <div className="border-border border-b p-4">
      {variant === "xs" ? (
        <div className="text-muted-foreground md:text-md flex flex-row items-center gap-x-2 text-xs tracking-widest uppercase">
          <span className="text-primary">{icon ?? <CaretRightIcon className="h-4 w-4" weight="bold" />}</span>
          <span className="font-bold">{title}</span>
        </div>
      ) : (
        <span className="text-muted-foreground flex flex-row items-center gap-x-2 text-sm">
          <span className="text-primary">{icon ?? <CaretRightIcon className="h-4 w-4" weight="bold" />}</span>
          <span className="font-bold">{title}</span>
        </span>
      )}
      {description && <p className="text-muted mt-1.5 text-xs">{description}</p>}
    </div>
    <div className={cn("p-4", bodyClassName)}>{children}</div>
  </div>
)
