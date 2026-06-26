import { ANALYSIS_STEPS, type AnalysisStatus } from "@packages/shared"
import { CheckIcon } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"

type ResultSkeletonProps = {
  status: AnalysisStatus
}
export const ResultSkeleton = ({ status }: ResultSkeletonProps) => {
  const { t } = useTranslation()

  return (
    <div className="h-full">
      <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-muted-foreground mb-4 text-base font-bold tracking-widest uppercase md:text-lg">
            {t("analyzer.hero.heading")}
          </h1>
          <h2 className="text-2xl leading-tight font-bold tracking-tight md:text-3xl lg:text-4xl">
            Analyzing your skills
            <span className="animation-duration-[1s] animate-pulse">_</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-xs whitespace-pre-line md:text-sm">
            Processing your inputs, this will take a moment...
          </p>
        </div>
      </section>
      <section className="px-4 pb-20 md:px-6 md:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="border-border text-muted border p-4 text-xs">Analysis in progress...</div>
          <div className="border-border mt-8 border p-4">
            <span className="text-muted-foreground text-sm">Processing</span>
            <div className="mt-4 flex flex-col gap-y-2">
              {ANALYSIS_STEPS_WITH_LABEL.map(({ step, label }, idx) => {
                const currentIdx =
                  status === "completed"
                    ? ANALYSIS_STEPS_WITH_LABEL.length
                    : ANALYSIS_STEPS_WITH_LABEL.findIndex(({ step }) => step === status)

                return (
                  <div
                    key={step}
                    className={cn("border-border flex flex-row items-center border-b pb-4", {
                      "animate-pulse": currentIdx === idx,
                      "border-none pb-0": idx === ANALYSIS_STEPS_WITH_LABEL.length - 1,
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

const ANALYSIS_STEPS_WITH_LABEL: { step: (typeof ANALYSIS_STEPS)[number]; label: string }[] = [
  { step: "uploading_cv", label: "Uploading CV..." },
  { step: "parsing_cv", label: "Parsing CV..." },
  { step: "analyzing", label: "Analyzing skills..." },
]
