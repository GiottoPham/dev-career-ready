import type { SessionConfig } from "@packages/shared"
import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"

import { api } from "@/lib/api"

type InterviewMutation = {
  sessionId: number
}

export const useInterviewMutation = () => {
  const postCreateInterviewSession = useCallback(
    (body: SessionConfig) =>
      api<InterviewMutation>("/interview", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
    []
  )
  return useMutation({ mutationFn: postCreateInterviewSession })
}
