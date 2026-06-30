import { ArrowRightIcon, CaretRightIcon } from "@phosphor-icons/react"
import { createFileRoute } from "@tanstack/react-router"
import { t } from "i18next"
import { useState } from "react"

import { useAllResults } from "@/api/queries/results"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NumberField } from "@/components/ui/number-field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { ResultCard } from "./-ResultCard"
import { ResultsPagination } from "./-ResultsPagination"

export const Route = createFileRoute("/_layout/_authenticated/mock-interview/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedResults, setSelectedResults] = useState<Map<number, boolean>>()

  const [questionNumbers, setQuestionNumbers] = useState(5)
  const [selectedFocusArea, setSelectedFocusArea] = useState<string | null>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>("medium")

  const { data, isFetching } = useAllResults({ limit: 3, page: currentPage })

  const isSelected = [...(selectedResults?.keys() ?? [])].length > 0

  if (!data) {
    return null
  }

  return (
    <div className="h-full">
      <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-muted-foreground mb-4 text-base font-bold tracking-widest uppercase md:text-lg">
            Mock Interview
          </h1>
          <h2 className="text-2xl leading-tight font-bold tracking-tight md:text-3xl lg:text-4xl">
            Practice with <span className="text-primary">questions</span>
            <br /> tailored to <span className="text-primary">your target role</span>.
          </h2>
          <p className="text-muted-foreground mt-4 text-xs whitespace-pre-line md:text-sm">
            Answer questions, get scored, find gaps.
          </p>
        </div>
      </section>
      <section className="px-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="border-border border">
            <div className="border-border text-muted-foreground md:text-md flex flex-row items-center gap-x-2 border-b p-4 text-xs tracking-widest uppercase">
              <CaretRightIcon className="text-primary h-4 w-4" weight="bold" />
              <span className="font-bold">Interview Source</span>
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
              <span className="font-bold">Session settings</span>
            </div>
            <div className="border-border flex flex-row justify-between gap-4 border-b p-4">
              <Label htmlFor="questionInput">Number of questions</Label>
              <NumberField
                min={5}
                max={20}
                showSteppers
                id="questionInput"
                value={questionNumbers}
                onValueChange={(value) => setQuestionNumbers(value ?? 0)}
                className="max-w-24"
              />
            </div>

            <div className="border-border flex flex-row justify-between gap-4 border-b p-4">
              <Label htmlFor="difficultSelect">Select difficulty</Label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DIFFICULTIES.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="border-border flex flex-row justify-between gap-4 border-b p-4">
              <Label htmlFor="difficultSelect">Focus Area</Label>
              <Select value={selectedFocusArea} onValueChange={setSelectedFocusArea}>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Select focus area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {FOCUS_AREAS.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
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
            Start Interview
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const DIFFICULTIES = ["easy", "medium", "hard"] as const
const FOCUS_AREAS = [
  { value: "all", label: "All skills" },
  { value: "gaps", label: "Gaps only" },
  { label: "Matched only", value: "matched" },
]
