import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

export type StatsResponse = {
  analysisCount: number
  sessionCompletedCount: number
  thisMonthAvg: number
  lastMonthAvg: number
}

export const useStats = () =>
  useQuery({
    queryKey: ["stats"],
    queryFn: () => api<StatsResponse>("/stats", { method: "GET" }),
  })
