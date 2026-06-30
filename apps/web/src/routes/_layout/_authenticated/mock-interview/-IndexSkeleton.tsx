import { CaretRightIcon } from "@phosphor-icons/react"
import { Trans, useTranslation } from "react-i18next"

export const IndexSkeleton = () => {
  const { t } = useTranslation()

  return (
    <div className="h-full">
      <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-muted-foreground mb-4 text-base font-bold tracking-widest uppercase md:text-lg">
            {t("mockInterview.hero.heading")}
          </h1>
          <h2 className="text-2xl leading-tight font-bold tracking-tight md:text-3xl lg:text-4xl">
            <Trans i18nKey="mockInterview.hero.title" components={{ h: <span className="text-primary" />, br: <br /> }} />
          </h2>
          <p className="text-muted-foreground mt-4 text-xs whitespace-pre-line md:text-sm">
            {t("mockInterview.hero.description")}
          </p>
        </div>
      </section>
      <section className="px-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="border-border border">
            <div className="border-border text-muted-foreground md:text-md flex flex-row items-center gap-x-2 border-b p-4 text-xs tracking-widest uppercase">
              <CaretRightIcon className="text-primary h-4 w-4" weight="bold" />
              <span className="font-bold">{t("mockInterview.source.label")}</span>
            </div>
            <div className="border-border grid grid-cols-1 gap-4 border-b p-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-border flex flex-col gap-y-2 border p-4">
                  <div className="bg-muted/10 h-4 w-3/4 animate-pulse" />
                  <div className="bg-muted/10 h-3 w-1/2 animate-pulse" />
                  <div className="bg-muted/10 mt-1 h-3 w-1/3 animate-pulse" />
                </div>
              ))}
            </div>
            <div className="p-4">
              <div className="bg-muted/10 h-6 w-40 animate-pulse" />
            </div>
          </div>
          <div className="border-border mt-10 border">
            <div className="border-border text-muted-foreground md:text-md flex flex-row items-center gap-x-2 border-b p-4 text-xs tracking-widest uppercase">
              <CaretRightIcon className="text-primary h-4 w-4" weight="bold" />
              <span className="font-bold">{t("mockInterview.settings.label")}</span>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-border flex flex-row items-center justify-between gap-4 border-b p-4 last:border-b-0">
                <div className="bg-muted/10 h-4 w-36 animate-pulse" />
                <div className="bg-muted/10 h-8 w-24 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="mt-8 px-4 pb-20 md:px-6 md:pb-32">
        <div className="mx-auto flex max-w-5xl flex-row items-center justify-end">
          <div className="bg-muted/10 h-10 w-36 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
