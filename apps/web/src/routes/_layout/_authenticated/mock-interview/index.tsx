import {
  DIFFICULTIES,
  FOCUS_AREAS,
  INTERVIEW_MODE,
  type Difficulty,
  type FocusArea,
  type InterviewMode,
  type ResultResponse,
  type SessionConfig,
} from "@packages/shared"
import { ArrowRightIcon, CaretRightIcon, CheckCircleIcon, TargetIcon } from "@phosphor-icons/react"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState, useTransition } from "react"
import { Trans, useTranslation } from "react-i18next"
import { z } from "zod"

import { useInterviewMutation } from "@/api/mutations/interview"
import { useAnalyzeResult } from "@/api/queries/analyze"
import { useAllResults } from "@/api/queries/results"
import { Button, buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NumberField } from "@/components/ui/number-field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import { IndexSkeleton } from "./-IndexSkeleton"
import { ResultCard } from "./-ResultCard"
import { ResultsPagination } from "./-ResultsPagination"

export const Route = createFileRoute("/_layout/_authenticated/mock-interview/")({
  validateSearch: z.object({ resultId: z.number().optional() }),
  component: RouteComponent,
})

function RouteComponent() {
  const { t, i18n } = useTranslation()
  const { resultId: preselectedId } = Route.useSearch()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedResult, setSelectedResult] = useState<ResultResponse>()

  const [questionNumbers, setQuestionNumbers] = useState(5)
  const [selectedFocusArea, setSelectedFocusArea] = useState<FocusArea>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium")
  const [selectedMode, setSelectedMode] = useState<InterviewMode>("project")

  const { data, isPending, isFetching } = useAllResults({ limit: 3, page: currentPage })
  const { data: preselectedData } = useAnalyzeResult({
    resultId: String(preselectedId ?? ""),
    enabled: !!preselectedId,
  })

  const selectedData = selectedResult || preselectedData?.result

  const selectedMeta = selectedData
    ? {
        title:
          selectedData.position && selectedData.company
            ? `${selectedData.position} @ ${selectedData.company}`
            : undefined,
        matched: selectedData.matchedSkills.length,
        gaps: selectedData.missingSkills.length,
      }
    : undefined

  const isSelected = !!selectedResult

  const [isTransitioning, startTransition] = useTransition()
  const navigate = useNavigate({ from: "/mock-interview/" })
  const { mutateAsync } = useInterviewMutation()

  const handleStartInterview = () => {
    startTransition(async () => {
      if (!selectedResult) return

      const config: SessionConfig = {
        resultId: selectedResult.id,
        difficulty: selectedDifficulty,
        focusArea: selectedFocusArea,
        mode: selectedMode,
        questionCount: questionNumbers,
        language: i18n.language as SessionConfig["language"],
      }

      const { sessionId } = await mutateAsync(config)
      await navigate({ to: "/mock-interview/sessions/$sessionId", params: { sessionId: `${sessionId}` } })
    })
  }
  if (isPending) {
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
            <div className="border-border border-b p-4">
              <div className="text-muted-foreground md:text-md flex flex-row items-center gap-x-2 text-xs tracking-widest uppercase">
                <CaretRightIcon className="text-primary h-4 w-4" weight="bold" />
                <span className="font-bold">{t("mockInterview.source.label")}</span>
              </div>
              <p className="text-muted mt-1.5 text-xs">{t("mockInterview.source.description")}</p>
            </div>
            {selectedMeta && (
              <div className="border-border flex items-center justify-between gap-4 border-b px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <CheckCircleIcon className="text-primary h-3.5 w-3.5 shrink-0" weight="fill" />
                  <span className="text-muted-foreground truncate text-xs">
                    {selectedMeta?.title ?? t("analyzer.results.fallbackTitle")}
                  </span>
                  {selectedMeta && (
                    <span className="text-muted shrink-0 text-xs">
                      · {selectedMeta.matched}&nbsp;{t("mockInterview.source.matched")}
                      &nbsp;· {selectedMeta.gaps}&nbsp;{t("mockInterview.source.gaps")}
                    </span>
                  )}
                </div>
                <Button variant="ghost" onClick={() => setSelectedResult(undefined)}>
                  {t("mockInterview.source.clear")}
                </Button>
              </div>
            )}
            {data?.data && data.total > 0 ? (
              <>
                <div
                  className={cn("border-border flex flex-col gap-4 border-b p-4 md:grid md:grid-cols-3", {
                    "opacity-50": isFetching,
                  })}
                >
                  {data.data.map((result) => {
                    const { matchedSkills, missingSkills, position, company, id, createdAt } = result
                    const isSelected = selectedResult?.id === id
                    const title =
                      !!position && !!company ? `${position} @ ${company}` : t("analyzer.results.fallbackTitle")

                    return (
                      <ResultCard
                        isSelected={isSelected}
                        onSelect={() => setSelectedResult(result)}
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
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 p-10 text-center">
                <TargetIcon className="text-muted h-8 w-8" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold">{t("mockInterview.emptyState.title")}</span>
                  <span className="text-muted-foreground text-xs">{t("mockInterview.emptyState.description")}</span>
                </div>
              </div>
            )}
          </div>
          {data?.data && data.total > 0 && (
            <div className="border-border mt-10 border">
              <div className="border-border text-muted-foreground md:text-md flex flex-row items-center gap-x-2 border-b p-4 text-xs tracking-widest uppercase">
                <CaretRightIcon className="text-primary h-4 w-4" weight="bold" />
                <span className="font-bold">{t("mockInterview.settings.label")}</span>
              </div>
              <div className="border-border flex flex-row justify-between gap-4 border-b p-4">
                <Label htmlFor="modeSelect">{t("mockInterview.settings.mode")}</Label>
                <Select
                  id="modeSelect"
                  value={selectedMode}
                  onValueChange={(value) => setSelectedMode(value as InterviewMode)}
                >
                  <SelectTrigger className="w-full max-w-42">
                    <SelectValue placeholder={t("mockInterview.settings.modePlaceholder")}>
                      {t(`mockInterview.settings.modes.${selectedMode}`)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {INTERVIEW_MODE.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {t(`mockInterview.settings.modes.${mode}`)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
                  className="max-w-42"
                />
              </div>
              <div className="border-border flex flex-row justify-between gap-4 border-b p-4">
                <Label htmlFor="difficultSelect">{t("mockInterview.settings.difficulty")}</Label>
                <Select
                  value={selectedDifficulty}
                  onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}
                >
                  <SelectTrigger className="w-full max-w-42">
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
                <Select value={selectedFocusArea} onValueChange={(value) => setSelectedFocusArea(value as FocusArea)}>
                  <SelectTrigger className="w-full max-w-42">
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
          )}
        </div>
      </section>
      <div className="mt-8 px-4 pb-20 md:px-6 md:pb-32">
        <div className="mx-auto flex max-w-5xl flex-row items-center justify-end">
          {data?.data && data.total > 0 ? (
            <Button
              onClick={handleStartInterview}
              className="gap-x-4"
              size="lg"
              disabled={!isSelected || isTransitioning}
            >
              {t("mockInterview.startButton")}
              {isTransitioning ? <Spinner className="h-4 w-4" /> : <ArrowRightIcon className="h-4 w-4" />}
            </Button>
          ) : (
            <Link to="/analyze" className={cn(buttonVariants({ size: "lg" }), "gap-x-4")}>
              {t("mockInterview.emptyState.cta")}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
