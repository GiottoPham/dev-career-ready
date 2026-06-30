import { ArrowRightIcon, CaretRightIcon } from "@phosphor-icons/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { Trans, useTranslation } from "react-i18next"

import { useAllResults } from "@/api/queries/results"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NumberField } from "@/components/ui/number-field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { IndexSkeleton } from "./-IndexSkeleton"
import { ResultCard } from "./-ResultCard"
import { ResultsPagination } from "./-ResultsPagination"

export const Route = createFileRoute("/_layout/_authenticated/mock-interview/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedResults, setSelectedResults] = useState<Map<number, boolean>>()

  const [questionNumbers, setQuestionNumbers] = useState(5)
  const [selectedFocusArea, setSelectedFocusArea] = useState<(typeof FOCUS_AREAS)[number]>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<(typeof DIFFICULTIES)[number]>("medium")

  const { data, isFetching } = useAllResults({ limit: 3, page: currentPage })

  const isSelected = [...(selectedResults?.keys() ?? [])].length > 0

  if (!data) {
    return <IndexSkeleton />
  }

  return (
    <div className="h-full">
      <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-muted-foreground mb-4 text-base font-bold tracking-widest uppercase md:text-lg">
            {t("mockInterview.hero.heading")}
          </h1>
          <h2 className="text-2xl leading-tight font-bold tracking-tight md:text-3xl lg:text-4xl">
            <Trans
              i18nKey="mockInterview.hero.title"
              components={{ h: <span className="text-primary" />, br: <br /> }}
            />
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
            <div
              className={cn("border-border flex flex-col gap-4 border-b p-4 md:grid md:grid-cols-3", {
                "opacity-50": isFetching,
              })}
            >
              {(data?.data ?? []).map(({ matchedSkills, missingSkills, position, company, id, createdAt }) => {
                const isSelected = selectedResults?.has(id)
                const newMap = new Map(selectedResults)
                const title = !!position && !!company ? `${position} @ ${company}` : t("analyzer.results.fallbackTitle")

                return (
                  <ResultCard
                    isSelected={isSelected}
                    onSelect={() => {
                      if (isSelected) {
                        newMap.delete(id)
                        setSelectedResults(newMap)
                      } else {
                        newMap.set(id, true)
                        setSelectedResults(newMap)
                      }
                    }}
                    key={id}
                    matcheds={matchedSkills.length}
                    gaps={missingSkills.length}
                    createdAt={createdAt}
                    id={id}
                    title={title}
                  />
                )
              })}
            </div>
            <div className="p-4">
              <ResultsPagination currentPage={currentPage} {...data} onPageChange={setCurrentPage} />
            </div>
          </div>
          <div className="border-border mt-10 border">
            <div className="border-border text-muted-foreground md:text-md flex flex-row items-center gap-x-2 border-b p-4 text-xs tracking-widest uppercase">
              <CaretRightIcon className="text-primary h-4 w-4" weight="bold" />
              <span className="font-bold">{t("mockInterview.settings.label")}</span>
            </div>
            <div className="border-border flex flex-row justify-between gap-4 border-b p-4">
              <Label htmlFor="questionInput">{t("mockInterview.settings.questionCount")}</Label>
              <NumberField
                min={5}
                max={20}
                showSteppers
                id="questionInput"
                value={questionNumbers}
                onValueChange={(value) => setQuestionNumbers(value ?? 0)}
                className="max-w-40"
              />
            </div>
            <div className="border-border flex flex-row justify-between gap-4 border-b p-4">
              <Label htmlFor="difficultSelect">{t("mockInterview.settings.difficulty")}</Label>
              <Select
                value={selectedDifficulty}
                onValueChange={(value) => setSelectedDifficulty(value as (typeof DIFFICULTIES)[number])}
              >
                <SelectTrigger className="w-full max-w-40">
                  <SelectValue placeholder={t("mockInterview.settings.difficultyPlaceholder")}>
                    {t(`mockInterview.settings.difficulties.${selectedDifficulty}`)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DIFFICULTIES.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {t(`mockInterview.settings.difficulties.${difficulty}`)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="border-border flex flex-row justify-between gap-4 border-b p-4">
              <Label htmlFor="focusAreaSelect">{t("mockInterview.settings.focusArea")}</Label>
              <Select
                value={selectedFocusArea}
                onValueChange={(value) => setSelectedFocusArea(value as (typeof FOCUS_AREAS)[number])}
              >
                <SelectTrigger className="w-full max-w-40">
                  <SelectValue placeholder={t("mockInterview.settings.focusAreaPlaceholder")}>
                    {t(`mockInterview.settings.focusAreas.${selectedFocusArea}`)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {FOCUS_AREAS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`mockInterview.settings.focusAreas.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>
      <div className="mt-8 px-4 pb-20 md:px-6 md:pb-32">
        <div className="mx-auto flex max-w-5xl flex-row items-center justify-end">
          <Button className="gap-x-4" size="lg" disabled={!isSelected}>
            {t("mockInterview.startButton")}
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const DIFFICULTIES = ["easy", "medium", "hard"] as const
const FOCUS_AREAS = ["all", "gaps", "matched"] as const
