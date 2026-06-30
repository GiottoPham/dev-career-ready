import type { AnalysisStatus } from "@packages/shared"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { useAnalyzeResult } from "@/api/queries/analyze"
import type { WorkerInMessage, WorkerOutMessage } from "@/workers/analyze-stream.worker.types"

import { Result } from "./-Result"
import { ResultSkeleton } from "./-ResultSkeleton"

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
    return null
  }

  if (status === "completed" && !!data?.result) {
    return <Result result={data!.result} />
  }

  return <ResultSkeleton status={status} />
}
