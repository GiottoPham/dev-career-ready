import type { InterviewSession, PaginatedResponse, SessionStatus } from "@packages/shared"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

import { api } from "@/lib/api"

export type InterviewSessionQuery = InterviewSession & { company: string; position: string }

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

export const useAllInterviewSession = ({
  status,
  limit,
  page,
}: {
  status?: SessionStatus
  limit: number
  page: number
}) => {
  const getResult = useCallback(
    () =>
      api<PaginatedResponse<InterviewSessionQuery>>(
        `/interview-sessions?limit=${limit}&page=${page}${status ? `&status=${status}` : ""}`,
        { method: "GET" }
      ),
    [limit, page, status]
  )

  return useQuery({
    queryKey: ["interview-sessions", limit, page, status],
    queryFn: getResult,
    placeholderData: keepPreviousData,
  })
}
