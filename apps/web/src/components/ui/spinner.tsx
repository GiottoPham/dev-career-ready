import { SpinnerBallIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <SpinnerBallIcon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      weight="duotone"
      className={cn("animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
