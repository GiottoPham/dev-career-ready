import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"

import { api } from "@/lib/api"

export const useAnalyzeMutation = () => {
  const postAnalyze = useCallback((formData: FormData) => api("/analyze", { method: "POST", body: formData }), [])
  return useMutation({ mutationFn: postAnalyze })
}
