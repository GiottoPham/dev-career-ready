import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  checkedIcon,
  uncheckedIcon,
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "lg" | "default"
  checkedIcon?: ReactNode
  uncheckedIcon?: ReactNode
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-1 aria-invalid:ring-1 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[size=default]:h-[18.4px] data-[size=default]:w-8 data-[size=lg]:h-6.5 data-[size=lg]:w-12 data-[size=sm]:h-3.5 data-[size=sm]:w-6",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="bg-background dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground pointer-events-none flex items-center justify-center rounded-full ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=lg]/switch:size-6 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=lg]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=lg]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0"
      >
        {checkedIcon && <div className="hidden group-data-checked/switch:block">{checkedIcon}</div>}
        {uncheckedIcon && <div className="hidden group-data-unchecked/switch:block">{uncheckedIcon}</div>}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
