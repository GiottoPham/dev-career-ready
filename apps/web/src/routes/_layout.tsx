import { ArrowRightIcon, ListIcon } from "@phosphor-icons/react"
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { LanguageSwitch } from "@/components/layout/LanguageSwitcher"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const RouteComponent = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  return (
    <div>
      <nav className="border-border bg-background fixed top-0 z-40 flex w-full items-center justify-between border-b px-4 py-3 md:px-6">
        <Link to="/" className="text-sm font-bold tracking-tight">
          {t("nav.brand")}
        </Link>
        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-4 md:flex">
            {[
              { label: t("nav.analyzer"), href: "/analyze" as const },
              {
                label: t("nav.mockInterview"),
                href: "/mock-interview" as const,
              },
            ].map(({ href, label }) => (
              <Link
                key={label}
                to={href}
                className={cn("text-xs font-bold", { "text-primary": pathname.includes(href) })}
              >
                {label}
              </Link>
            ))}
            <Link to="/analyze" className={cn(buttonVariants({ variant: "default", size: "sm" }))}>
              {t("nav.start")} <ArrowRightIcon size={12} weight="bold" />
            </Link>
          </div>
          <div className="ml-2 shrink-0">
            <LanguageSwitch />
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon-sm" className="ml-1 md:hidden" />}>
              <ListIcon size={20} weight="bold" />
              <span className="sr-only">{t("nav.openMenu")}</span>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{t("nav.brand")}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 px-4">
                <SheetClose
                  nativeButton={false}
                  render={<Link to="/analyze" />}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "justify-start")}
                >
                  {t("nav.analyzer")}
                </SheetClose>
                <SheetClose
                  nativeButton={false}
                  render={<Link to="/analyze" />}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "justify-start")}
                >
                  {t("nav.mockInterview")}
                </SheetClose>
                <SheetClose
                  nativeButton={false}
                  render={<Link to="/analyze" />}
                  className={cn(buttonVariants({ variant: "default", size: "sm" }), "justify-start gap-1")}
                >
                  {t("nav.start")} <ArrowRightIcon size={12} weight="bold" />
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      <Outlet />
      {/* Footer */}
      <footer className="border-border border-t px-4 py-6 md:px-6">
        <div className="text-muted-foreground mx-auto flex max-w-5xl flex-col items-center gap-2 text-xs md:flex-row md:justify-between">
          <span>{t("footer.credit")}</span>
          <div className="flex gap-3">
            <a
              href="https://github.com/GiottoPham"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              github
            </a>
            <span>·</span>
            <a href="#" className="hover:text-foreground">
              {t("footer.about")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
})
