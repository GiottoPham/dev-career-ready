import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"

import { api } from "@/lib/api"

type AnalyzeMutation = {
  resultId: number
}

export const useAnalyzeMutation = () => {
  const postAnalyze = useCallback(
    (formData: FormData) => api<AnalyzeMutation>("/analyze", { method: "POST", body: formData }),
    []
  )
  return useMutation({ mutationFn: postAnalyze })
}
