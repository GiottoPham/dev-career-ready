import { useTranslation } from "react-i18next"

export const SessionSkeleton = () => {
  const { t } = useTranslation()

  return (
    <div className="h-full">
      <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-muted-foreground mb-4 text-base font-bold tracking-widest uppercase md:text-lg">
            {t("mockInterview.session.heading")}
          </h1>
          <div className="bg-muted/10 h-8 w-2/3 animate-pulse md:h-10" />
          <div className="mt-4 flex items-center gap-3">
            <div className="bg-muted/10 h-3.5 w-20 animate-pulse" />
            <div className="bg-muted/10 h-3.5 w-24 animate-pulse" />
            <div className="bg-muted/10 h-3.5 w-28 animate-pulse" />
          </div>
        </div>
      </section>
      <div className="px-4 pb-20 md:px-6 md:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="border-border border">
            <div className="border-border flex items-center justify-between border-b p-4">
              <div className="bg-muted/10 h-3.5 w-28 animate-pulse" />
            </div>
            <div className="bg-muted/10 h-1 w-full" />
            <div className="border-border border-b p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="bg-muted/10 h-3 w-20 animate-pulse" />
                <div className="bg-muted/10 h-3 w-16 animate-pulse" />
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="bg-muted/10 h-3.5 w-full animate-pulse" />
                <div className="bg-muted/10 h-3.5 w-5/6 animate-pulse" />
                <div className="bg-muted/10 h-3.5 w-3/4 animate-pulse" />
              </div>
            </div>
            <div className="border-border border-b p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="bg-muted/10 h-3 w-24 animate-pulse" />
                <div className="bg-muted/10 h-3 w-20 animate-pulse" />
              </div>
              <div className="bg-muted/10 h-50 w-full animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <div className="bg-muted/10 h-11 w-40 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
