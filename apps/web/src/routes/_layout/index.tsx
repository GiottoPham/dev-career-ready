import {
  ArrowRightIcon,
  TargetIcon,
  MicrophoneIcon,
  ChartLineUpIcon,
  CubeIcon,
  LightningIcon,
  LockOpenIcon,
  TranslateIcon,
} from "@phosphor-icons/react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Trans, useTranslation } from "react-i18next"

import { HeroIllustration } from "@/components/hero-illustration"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/_layout/")({
  component: Home,
})

const stats = [
  { icon: CubeIcon, label: "stats.modules" as const },
  { icon: LightningIcon, label: "stats.aiPowered" as const },
  { icon: LockOpenIcon, label: "stats.freeOpen" as const },
  { icon: TranslateIcon, label: "stats.language" as const },
]

function Home() {
  const { t } = useTranslation()

  const steps = [
    {
      num: "01",
      title: t("howItWorks.steps.pasteUpload.title"),
      desc: t("howItWorks.steps.pasteUpload.desc"),
      features: t("howItWorks.steps.pasteUpload.features", { returnObjects: true }) as string[],
    },
    {
      num: "02",
      title: t("howItWorks.steps.gapAnalysis.title"),
      desc: t("howItWorks.steps.gapAnalysis.desc"),
      features: t("howItWorks.steps.gapAnalysis.features", { returnObjects: true }) as string[],
    },
    {
      num: "03",
      title: t("howItWorks.steps.practice.title"),
      desc: t("howItWorks.steps.practice.desc"),
      features: t("howItWorks.steps.practice.features", { returnObjects: true }) as string[],
    },
  ]

  const modules = [
    {
      icon: TargetIcon,
      title: t("modules.skillGap.title"),
      desc: t("modules.skillGap.desc"),
      tags: t("modules.skillGap.tags", { returnObjects: true }) as string[],
      href: "/analyze" as const,
    },
    {
      icon: MicrophoneIcon,
      title: t("modules.mockInterview.title"),
      desc: t("modules.mockInterview.desc"),
      tags: t("modules.mockInterview.tags", { returnObjects: true }) as string[],
      href: "/analyze" as const,
    },
    {
      icon: ChartLineUpIcon,
      title: t("modules.dashboard.title"),
      desc: t("modules.dashboard.desc"),
      tags: t("modules.dashboard.tags", { returnObjects: true }) as string[],
      href: "/analyze" as const,
    },
  ]

  return (
    <main>
      {/* Hero */}
      <section
        className="border-border border-b px-4 py-20 md:px-6 md:py-32"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(251,191,36,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl leading-tight font-bold tracking-tight md:text-5xl lg:text-6xl">
            <Trans i18nKey="hero.line1" components={{ h: <span className="text-primary" /> }} />
            <br />
            <Trans i18nKey="hero.line2" components={{ h: <span className="text-primary" /> }} />
            <br />
            <Trans i18nKey="hero.line3" components={{ h: <span className="text-primary" /> }} />
          </h1>
          <div className="mt-4 grid md:grid-cols-[3fr_2fr] md:items-center md:gap-12">
            <div>
              <p className="text-foreground/70 text-sm leading-relaxed md:text-base">{t("hero.description")}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                <Link to="/analyze" className={cn(buttonVariants({ size: "lg" }), "gap-1.5")}>
                  {t("hero.analyzeBtn")}
                  <ArrowRightIcon size={14} weight="bold" />
                </Link>
                <Link to="/analyze" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
                  {t("hero.mockBtn")}
                </Link>
              </div>
            </div>
            <div className="hidden md:flex md:items-center md:justify-center">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-border border-b">
        <div className="mx-auto grid max-w-5xl grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-border text-muted-foreground flex items-center gap-2 border-r px-4 py-3 text-xs last:border-r-0 [&_svg]:text-amber-400"
            >
              <stat.icon size={14} weight="bold" />
              {t(stat.label)}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-border border-b px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-muted-foreground mb-10 text-3xl font-extrabold">{t("howItWorks.label")}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.num} className="border-border border p-5 transition-colors hover:border-amber-400">
                <span className="text-xs text-amber-400">{step.num}_</span>
                <h3 className="mt-3 text-sm font-bold">{step.title}</h3>
                <p className="text-foreground/70 mt-2 text-xs leading-relaxed">{step.desc}</p>
                <ul className="mt-4 space-y-1">
                  {step.features.map((f) => (
                    <li key={f} className="text-muted-foreground text-xs">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="border-border border-b px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-muted-foreground mb-10 text-3xl font-bold">{t("modules.label")}</p>
          <div className="space-y-4">
            {modules.map((mod) => (
              <div
                key={mod.title}
                className="border-border flex flex-col gap-5 border p-5 transition-colors hover:border-amber-400 md:flex-row md:items-start md:gap-6"
              >
                <div className="flex shrink-0 sm:items-center sm:justify-center">
                  <mod.icon size={24} weight="bold" className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold">{mod.title}</h3>
                  <p className="text-foreground/70 mt-2 text-xs leading-relaxed">{mod.desc}</p>
                  <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:justify-between sm:gap-y-0">
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {mod.tags.map((tag) => (
                        <span key={tag} className="border border-amber-400/50 px-2 py-0.5 text-[10px] text-amber-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={mod.href}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "xs" }),
                        "-ml-2 w-20 gap-1 sm:-mr-2 sm:ml-0"
                      )}
                    >
                      {t("modules.tryIt")}
                      <ArrowRightIcon size={10} weight="bold" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-xl font-bold md:text-2xl">{t("cta.heading")}</h2>
          <div className="mt-6">
            <Link to="/analyze" className={cn(buttonVariants({ size: "lg" }), "gap-1.5")}>
              {t("cta.button")}
              <ArrowRightIcon size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
