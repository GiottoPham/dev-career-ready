import { CaretRightIcon } from "@phosphor-icons/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NumberField } from "@/components/ui/number-field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
            <div className="border-border flex flex-col gap-4 border-b p-4 md:grid md:grid-cols-3">
              {RESULTS.map((result) => {
                const isSelected = selectedResults?.has(result.id)
                const newMap = new Map(selectedResults)
                return (
                  <ResultCard
                    isSelected={isSelected}
                    onSelect={() => {
                      if (isSelected) {
                        newMap.delete(result.id)
                        setSelectedResults(newMap)
                      } else {
                        newMap.set(result.id, true)
                        setSelectedResults(newMap)
                      }
                    }}
                    key={result.id}
                    {...result}
                  />
                )
              })}
            </div>
            <div className="p-4">
              <ResultsPagination currentPage={currentPage} {...FAKE_PAGINATIONS} onPageChange={setCurrentPage} />
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
          <Button className="gap-x-4" size="lg">
            Start Interview
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

const RESULTS = [
  {
    id: 1,
    title: "React Developer @ Acme Corp",
    matcheds: 10,
    gaps: 20,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "React Developer @ Acme Corp",
    matcheds: 10,
    gaps: 20,
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "React Developer @ Acme Corp",
    matcheds: 10,
    gaps: 20,
    createdAt: new Date(),
  },
  {
    id: 4,
    title: "React Developer @ Acme Corp",
    matcheds: 10,
    gaps: 20,
    createdAt: new Date(),
  },
]

const FAKE_PAGINATIONS = {
  limit: 4,
  totalPage: 4,
  total: 20,
}
