import type { AnalysisResultResponse } from "@packages/shared"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

import { api } from "@/lib/api"

export const useAnalyzeResult = ({ resultId }: { resultId: string }) => {
  const getAnalyzeResult = useCallback(
    () => api<AnalysisResultResponse>(`/analyze/results/${resultId}`, { method: "GET" }),
    [resultId]
  )
  return useQuery({
    queryKey: ["analyze-result", resultId],
    queryFn: getAnalyzeResult,
    placeholderData: keepPreviousData,
  })
}
