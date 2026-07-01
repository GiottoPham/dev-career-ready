import type { InterviewSession } from "@packages/shared"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

import { api } from "@/lib/api"

type InterviewSessionQuery = InterviewSession & { company?: string; position?: string }

export const useInterviewSession = ({ sessionId }: { sessionId: number }) => {
  const getResult = useCallback(
    () => api<InterviewSessionQuery>(`/interview-sessions/${sessionId}`, { method: "GET" }),
    [sessionId]
  )

  return useQuery({
    queryKey: ["interview-sessions", sessionId],
    queryFn: getResult,
    placeholderData: keepPreviousData,
  })
}
