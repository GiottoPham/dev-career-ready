import type { PaginatedResponse, ResultResponse } from "@packages/shared"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

import { api } from "@/lib/api"

export const useAllResults = ({ limit, page }: { limit: number; page: number }) => {
  const getResults = useCallback(
    () => api<PaginatedResponse<ResultResponse>>(`/results?limit=${limit}&page=${page}`, { method: "GET" }),
    [limit, page]
  )

  return useQuery({
    queryKey: ["results", limit, page],
    queryFn: getResults,
    placeholderData: keepPreviousData,
  })
}
