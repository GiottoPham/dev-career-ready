import { ANALYSIS_STEPS, type AnalysisStatus } from "@packages/shared"
import { CheckIcon } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"

type ResultSkeletonProps = {
  status: AnalysisStatus
}
export const ResultSkeleton = ({ status }: ResultSkeletonProps) => {
  const { t } = useTranslation()

  const stepsWithLabel: { step: (typeof ANALYSIS_STEPS)[number]; label: string }[] = [
    { step: "uploading_cv", label: t("analyzer.skeleton.steps.uploadingCv") },
    { step: "parsing_cv", label: t("analyzer.skeleton.steps.parsingCv") },
    { step: "analyzing", label: t("analyzer.skeleton.steps.analyzing") },
  ]

  return (
    <div className="h-full">
      <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-muted-foreground mb-4 text-base font-bold tracking-widest uppercase md:text-lg">
            {t("analyzer.hero.heading")}
          </h1>
          <h2 className="text-2xl leading-tight font-bold tracking-tight md:text-3xl lg:text-4xl">
            {t("analyzer.skeleton.heading")}
            <span className="animation-duration-[1s] animate-pulse">_</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-xs whitespace-pre-line md:text-sm">
            {t("analyzer.skeleton.subCopy")}
          </p>
        </div>
      </section>
      <section className="px-4 pb-20 md:px-6 md:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="border-border text-muted border p-4 text-xs">{t("analyzer.skeleton.statusBar")}</div>
          <div className="border-border mt-8 border p-4">
            <span className="text-muted-foreground text-sm">{t("analyzer.skeleton.processingLabel")}</span>
            <div className="mt-4 flex flex-col gap-y-2">
              {stepsWithLabel.map(({ step, label }, idx) => {
                const currentIdx =
                  status === "completed"
                    ? stepsWithLabel.length
                    : stepsWithLabel.findIndex(({ step: s }) => s === status)

                return (
                  <div
                    key={step}
                    className={cn("border-border flex flex-row items-center border-b pb-4", {
                      "animate-pulse": currentIdx === idx,
                      "border-none pb-0": idx === stepsWithLabel.length - 1,
                    })}
                  >
                    <div className="min-w-6">
                      {currentIdx === idx && <div className="bg-primary h-1.5 w-1.5 rounded-full" />}
                      {currentIdx > idx && <CheckIcon className="text-primary h-3 w-3" weight="bold" />}
                      {currentIdx < idx && <span className="text-muted">-</span>}
                    </div>
                    <span
                      className={cn("text-xs", {
                        "text-muted": currentIdx < idx,
                      })}
                    >
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-8 flex flex-row gap-x-4">
            <div className="bg-muted/10 h-20 w-1/3 animate-pulse" />
            <div className="bg-muted/10 h-20 w-1/3 animate-pulse" />
            <div className="bg-muted/10 h-20 w-1/3 animate-pulse" />
          </div>
          <div className="bg-muted/10 mt-8 h-60 w-full animate-pulse" />
          <div className="bg-muted/10 mt-8 h-40 w-full animate-pulse" />
        </div>
      </section>
    </div>
  )
}
