import type { AnalysisStatus } from "@packages/shared"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { useAnalyzeResult } from "@/api/queries/analyze"
import { cn } from "@/lib/utils"
import type { WorkerInMessage, WorkerOutMessage } from "@/workers/analyze-stream.worker.types"

import { Result } from "./-Result"
import { ResultSkeleton } from "./-ResultSkeleton"

const SkeletonRow = ({ width, last = false }: { width: string; last?: boolean }) => (
  <div className={cn("border-border flex items-center gap-3 border-b pb-4", { "border-none pb-0": last })}>
    <div className="bg-muted/10 h-3 w-3 shrink-0 animate-pulse" />
    <div className={cn("bg-muted/10 h-3 animate-pulse", width)} />
  </div>
)

const SkeletonMissingRow = ({ width, last = false }: { width: string; last?: boolean }) => (
  <div className={cn("border-border flex items-center justify-between border-b pb-4", { "border-none pb-0": last })}>
    <div className="flex items-center gap-3">
      <div className="bg-muted/10 h-3 w-3 shrink-0 animate-pulse" />
      <div className={cn("bg-muted/10 h-3 animate-pulse", width)} />
    </div>
    <div className="bg-muted/10 h-3 w-12 animate-pulse" />
  </div>
)

const SkeletonTipRow = ({ lines, last = false }: { lines: string[]; last?: boolean }) => (
  <div className={cn("border-border flex items-start gap-3 border-b pb-4", { "border-none pb-0": last })}>
    <div className="bg-muted/10 mt-0.5 h-3 w-3 shrink-0 animate-pulse" />
    <div className="flex flex-1 flex-col gap-1.5">
      {lines.map((w, i) => (
        <div key={i} className={cn("bg-muted/10 h-3 animate-pulse", w)} />
      ))}
    </div>
  </div>
)

const ResultPageSkeleton = () => {
  return (
    <div className="h-full">
      <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <div className="bg-muted/10 mb-4 h-5 w-36 animate-pulse" />
          <div className="bg-muted/10 h-3 w-16 animate-pulse" />
          <div className="bg-muted/10 mt-2 h-9 w-2/3 animate-pulse" />
          <div className="bg-muted/10 mt-4 h-4 w-1/2 animate-pulse" />
        </div>
      </section>
      <section className="px-4 pb-20 md:px-6 md:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="border-border border p-4">
            <div className="bg-muted/10 h-3 w-48 animate-pulse" />
          </div>
          <div className="border-border mt-8 border">
            <div className="border-border border-b p-4">
              <div className="bg-muted/10 h-4 w-36 animate-pulse" />
            </div>
            <div className="flex flex-col gap-y-2 p-4">
              <SkeletonRow width="w-48" />
              <SkeletonRow width="w-56" />
              <SkeletonRow width="w-40" />
              <SkeletonRow width="w-52" last />
            </div>
          </div>
          <div className="border-border mt-8 border">
            <div className="border-border border-b p-4">
              <div className="bg-muted/10 h-4 w-36 animate-pulse" />
            </div>
            <div className="flex flex-col gap-y-2 p-4">
              <SkeletonMissingRow width="w-44" />
              <SkeletonMissingRow width="w-52" />
              <SkeletonMissingRow width="w-36" last />
            </div>
          </div>
          <div className="border-border mt-8 border">
            <div className="border-border border-b p-4">
              <div className="bg-muted/10 h-4 w-32 animate-pulse" />
            </div>
            <div className="flex flex-col gap-y-2 p-4">
              <SkeletonTipRow lines={["w-full", "w-3/4"]} />
              <SkeletonTipRow lines={["w-full", "w-full", "w-1/2"]} />
              <SkeletonTipRow lines={["w-full", "w-2/3"]} last />
            </div>
          </div>
          <div className="mt-8 flex flex-row justify-end gap-x-4">
            <div className="bg-muted/10 h-10 w-36 animate-pulse" />
            <div className="bg-muted/10 h-10 w-36 animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  )
}

export const Route = createFileRoute("/_layout/_authenticated/analyze/results/$resultId")({
  component: RouteComponent,
})

function RouteComponent() {
  const { resultId } = Route.useParams()
  const { data, refetch, isPending } = useAnalyzeResult({ resultId })

  const [status, setStatus] = useState<AnalysisStatus>("pending")

  useEffect(() => {
    if (isPending) {
      return
    }

    if (data?.result) {
      setTimeout(() => {
        setStatus(data.status)
      })
      return
    }

    const worker = new Worker(new URL("@/workers/analyze-stream.worker.ts", import.meta.url), {
      type: "module",
    })
    worker.postMessage({ type: "start", resultId } satisfies WorkerInMessage)

    worker.onmessage = (event: MessageEvent<WorkerOutMessage>) => {
      const msg = event.data
      if (msg.type === "status") {
        setStatus(msg.status)
        if (msg.status === "completed" || msg.status === "failed") {
          refetch()
          worker.terminate()
        }
      } else if (msg.type === "error") {
        worker.terminate()
      }
    }

    worker.onerror = () => worker.terminate()

    return () => worker.terminate()
  }, [data?.result, data?.status, isPending, refetch, resultId])

  if (isPending) {
    return <ResultPageSkeleton />
  }

  if (status === "completed" && !!data?.result) {
    return <Result result={data!.result} />
  }

  return <ResultSkeleton status={status} />
}
