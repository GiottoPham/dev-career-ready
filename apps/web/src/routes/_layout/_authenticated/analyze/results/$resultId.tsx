import type { AnalysisStatus } from "@packages/shared"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { useAnalyzeResult } from "@/api/queries/analyze"

import { Result } from "./-Result"
import { ResultSkeleton } from "./-ResultSkeleton"

export const Route = createFileRoute("/_layout/_authenticated/analyze/results/$resultId")({
  component: RouteComponent,
})

const API_URL = import.meta.env.VITE_API_URL

function RouteComponent() {
  const { resultId } = Route.useParams()
  const { data, refetch, isPending } = useAnalyzeResult({ resultId })

  const [status, setStatus] = useState<AnalysisStatus>("pending")

  console.log("status", status)
  console.log("results", data?.result)
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

    const es = new EventSource(`${API_URL}/api/analyze/results/${resultId}/stream`, { withCredentials: true })

    es.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setStatus(data.status)
      if (data.status === "completed" || data.status === "failed") {
        refetch()
        es.close()
      }
    }

    es.onerror = () => {
      es.close()
    }

    return () => es.close()
  }, [data?.result, data?.status, isPending, refetch, resultId])

  if (isPending) {
    return null
  }

  if (status === "completed" && !!data?.result) {
    return <Result result={data!.result} />
  }

  return <ResultSkeleton status={status} />
}
