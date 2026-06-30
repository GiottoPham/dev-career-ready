import type { AnalysisStatus } from "@packages/shared"

import type { WorkerInMessage, WorkerOutMessage } from "./analyze-stream.worker.types"

self.onmessage = (event: MessageEvent<WorkerInMessage>) => {
  if (event.data.type !== "start") return
  const { resultId } = event.data

  const es = new EventSource(`/api/analyze/results/${resultId}/stream`, { withCredentials: true })

  es.onmessage = (e: MessageEvent) => {
    const data = JSON.parse(e.data) as { status: AnalysisStatus }
    self.postMessage({ type: "status", status: data.status } satisfies WorkerOutMessage)
    if (data.status === "completed" || data.status === "failed") {
      es.close()
    }
  }

  es.onerror = () => {
    es.close()
    self.postMessage({ type: "error" } satisfies WorkerOutMessage)
  }
}
