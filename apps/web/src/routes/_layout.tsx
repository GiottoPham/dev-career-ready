import { ArrowRightIcon, ListIcon } from "@phosphor-icons/react"
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { LanguageSwitch } from "@/components/layout/LanguageSwitcher"
import { UserAvatar } from "@/components/layout/UserAvatar"
import { UserMenu } from "@/components/layout/UserMenu"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { signOut, useSession } from "@/lib/auth-client"
import { FOOTER_HEIGHT } from "@/lib/constant"
import { cn } from "@/lib/utils"

const RouteComponent = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const pathname = useLocation({
    select: (location) => location.pathname,
  })
  const { data: session } = useSession()

  const TABS = useMemo(
    () => [
      { label: t("nav.analyzer"), href: "/analyze" as const },
      {
        label: t("nav.mockInterview"),
        href: "/mock-interview" as const,
      },
      {
        label: t("nav.dashboard"),
        href: "/dashboard" as const,
      },
      {
        label: t("nav.community"),
        href: "/community" as const,
      },
    ],
    [t]
  )
  return (
    <div>
      <nav className="border-border bg-background fixed top-0 z-40 flex w-full items-center justify-between border-b px-4 py-3 md:px-6">
        <Link to="/" className="text-sm font-bold tracking-tight">
          {t("nav.brand")}
        </Link>
        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-1 md:flex">
            {TABS.map(({ href, label }) => (
              <Link
                key={label}
                to={href}
                className={cn(
                  "text-muted-foreground hover:text-foreground px-2.5 py-1 text-xs font-bold transition-colors",
                  { "text-primary": pathname.includes(href) }
                )}
              >
                {label}
              </Link>
            ))}
            <div className="bg-muted mx-2 h-7 w-px" />
            {session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <Link to="/auth" className={cn(buttonVariants({ variant: "default", size: "sm" }))}>
                {t("nav.signIn")} <ArrowRightIcon size={12} weight="bold" />
              </Link>
            )}
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
                {TABS.map(({ href, label }) => (
                  <SheetClose
                    key={label}
                    nativeButton={false}
                    render={<Link to={href} />}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "justify-start", {
                      "text-primary": pathname.includes(href),
                    })}
                  >
                    {label}
                  </SheetClose>
                ))}

                {session?.user ? (
                  <>
                    <div className="border-border mt-2 border-t pt-3">
                      <div className="flex items-center gap-3 px-2 py-1">
                        <UserAvatar user={session.user} />
                        <div>
                          <p className="text-xs font-bold">{session.user.name}</p>
                          <p className="text-muted-foreground text-[10px]">{session.user.email}</p>
                        </div>
                      </div>
                    </div>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          to="/"
                          onClick={async () => {
                            await signOut()
                          }}
                        />
                      }
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "justify-start")}
                    >
                      {t("nav.signOut")}
                    </SheetClose>
                  </>
                ) : (
                  <SheetClose
                    nativeButton={false}
                    render={<Link to="/auth" />}
                    className={cn(buttonVariants({ variant: "default", size: "sm" }), "justify-start gap-1")}
                  >
                    {t("nav.signIn")} <ArrowRightIcon size={12} weight="bold" />
                  </SheetClose>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      <div style={{ minHeight: `calc(100vh - ${FOOTER_HEIGHT})` }}>
        <Outlet />
      </div>
      {/* Footer */}
      <footer className="border-border h-16 border-t px-4 py-6 md:px-6">
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
            <a href="https://giottopham.is-a.dev" className="hover:text-foreground">
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
