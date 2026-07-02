import type { AnalysisStatus } from "@packages/shared"

export type WorkerInMessage = { type: "start"; resultId: string }
export type WorkerOutMessage = { type: "status"; status: AnalysisStatus; error?: string } | { type: "error" }
