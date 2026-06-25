import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/_authenticated/analyze/results/$resultId")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-full">
      <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-muted-foreground mb-4 text-base font-bold tracking-widest uppercase md:text-lg">
            {/* {t("analyzer.hero.heading")} */}
          </h1>
          <h2 className="text-2xl leading-tight font-bold tracking-tight md:text-3xl lg:text-4xl">
            {/* <Trans i18nKey="hero.line1" components={{ h: <span className="text-primary" /> }} /> */}
          </h2>
          <p className="text-muted-foreground mt-4 text-xs whitespace-pre-line md:text-sm">
            {/* {t("analyzer.hero.description1")} */}
          </p>
          <p className="text-muted-foreground mt-1 text-xs whitespace-pre-line md:text-sm">
            {/* {t("analyzer.hero.description2")} */}
          </p>
        </div>
      </section>
      <section className="px-4 md:px-6"></section>
    </div>
  )
}
