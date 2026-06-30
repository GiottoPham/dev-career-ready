import type { AnalysisStatus } from "@packages/shared"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { useAnalyzeResult } from "@/api/queries/analyze"
import type { WorkerInMessage, WorkerOutMessage } from "@/workers/analyze-stream.worker.types"

import { Result } from "./-Result"
import { ResultSkeleton } from "./-ResultSkeleton"

function ResultPageSkeleton() {
  return (
    <div className="h-full">
      <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <div className="bg-muted/10 mb-4 h-5 w-32 animate-pulse" />
          <div className="bg-muted/10 h-10 w-2/3 animate-pulse" />
          <div className="bg-muted/10 mt-4 h-4 w-1/2 animate-pulse" />
        </div>
      </section>
      <section className="px-4 pb-20 md:px-6 md:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="bg-muted/10 h-10 w-full animate-pulse" />
          <div className="bg-muted/10 mt-8 h-36 w-full animate-pulse" />
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
