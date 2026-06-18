import { ArrowRightIcon } from "@phosphor-icons/react"
import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { LanguageSwitch } from "@/components/layout/LanguageSwitcher"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const RouteComponent = () => {
  const { t } = useTranslation()

  return (
    <div>
      <nav className="border-border flex items-center justify-between border-b px-4 py-3 md:px-6">
        <Link to="/" className="text-sm font-bold tracking-tight">
          {t("nav.brand")}
        </Link>
        <div className="flex items-center gap-1">
          <Link to="/analyze" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            {t("nav.analyzer")}
          </Link>
          <Link to="/analyze" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            {t("nav.mockInterview")}
          </Link>
          <Link to="/analyze" className={cn(buttonVariants({ variant: "default", size: "sm" }))}>
            {t("nav.start")} <ArrowRightIcon size={12} weight="bold" />
          </Link>
          <div className="ml-2 shrink-0">
            <LanguageSwitch />
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  )
}

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
})
