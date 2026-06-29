import { type AnalysisResultResponse } from "@packages/shared"
import { ArrowRightIcon, CheckIcon, LightbulbIcon, XIcon } from "@phosphor-icons/react"
import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ResultSkeletonProps = {
  result: NonNullable<AnalysisResultResponse["result"]>
}
export const Result = ({ result }: ResultSkeletonProps) => {
  const { t } = useTranslation()
  const { company, position, cvTips, matchedSkills, missingSkills } = result

  const title = !!position && !!company ? `${position} @ ${company}` : "Analyzed Result"

  const totalSkillsCount = missingSkills.length + matchedSkills.length

  return (
    <div className="h-full">
      <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-muted-foreground mb-4 text-base font-bold tracking-widest uppercase md:text-lg">
            {t("analyzer.hero.heading")}
          </h1>
          <span className="text-muted-foreground text-xs">Results for</span>
          <h2 className="text-primary text-2xl leading-tight font-bold tracking-tight md:text-3xl lg:text-4xl">
            {title}
          </h2>
          <p className="text-muted-foreground mt-4 text-xs whitespace-pre-line md:text-sm">
            {matchedSkills.length} matched · {missingSkills.length} gaps · {totalSkillsCount} total{" "}
          </p>
        </div>
      </section>
      <section className="px-4 pb-20 md:px-6 md:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="border-border text-muted-foreground border p-4 text-xs">
            Analysis complete · {totalSkillsCount} skills evaluated
          </div>
          <div className="border-border mt-8 border">
            <div className="border-border border-b p-4">
              <span className="text-muted-foreground text-sm"> -- Matched Skills </span>
            </div>
            <div className="flex flex-col gap-y-2 p-4">
              {matchedSkills.map((skill, idx) => (
                <div
                  key={skill}
                  className={cn("border-border flex flex-row items-start border-b pb-4", {
                    "border-none pb-0": idx === matchedSkills.length - 1,
                  })}
                >
                  <div className="min-w-6">
                    <CheckIcon className="text-primary mt-0.5 h-3 w-3" />
                  </div>
                  <span className="text-xs">{skill}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-border mt-8 border">
            <div className="border-border border-b p-4">
              <span className="text-muted-foreground text-sm"> -- Missing Skills </span>
            </div>
            <div className="flex flex-col gap-y-2 p-4">
              {missingSkills.map(({ skill, priority }, idx) => (
                <div
                  key={skill}
                  className={cn("border-border flex flex-row items-center justify-between border-b pb-4", {
                    "border-none pb-0": idx === missingSkills.length - 1,
                  })}
                >
                  <div className="flex flex-row items-center">
                    <div className="min-w-6">
                      <XIcon className="mt-0.5 h-3 w-3" />
                    </div>
                    <span className="text-xs">{skill}</span>
                  </div>
                  <span
                    className={cn(
                      "text-xs",
                      { "text-primary": priority === "high" },
                      { "text-muted-foreground": priority === "medium" },
                      { "text-muted": priority === "low" }
                    )}
                  >
                    {priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-border mt-8 border">
            <div className="border-border border-b p-4">
              <span className="text-muted-foreground text-sm"> -- CV Quick Tips</span>
            </div>
            <div className="flex flex-col gap-y-2 p-4">
              {cvTips.map((tip, idx) => (
                <div
                  key={tip}
                  className={cn("border-border flex flex-row items-start border-b pb-4", {
                    "border-none pb-0": idx === cvTips.length - 1,
                  })}
                >
                  <div className="min-w-6">
                    <LightbulbIcon className="mt-0.5 h-3 w-3 text-amber-200" weight="fill" />
                  </div>
                  <span className="text-muted-foreground text-xs">{tip}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-row justify-end gap-x-4">
            <Link to="/mock-interview" className={cn(buttonVariants({ variant: "default", size: "lg" }))}>
              Practice now
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link to="/analyze" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
              Start New Analysis
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
