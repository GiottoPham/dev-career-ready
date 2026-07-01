import { toNodeHandler } from "better-auth/node"
import cors from "cors"
import express, { json, type ErrorRequestHandler } from "express"
import morgan from "morgan"

import { auth } from "./lib/auth"
import { analyzeRouter } from "./routes/analyze"
import { healthRouter } from "./routes/health"
import { interviewRouter } from "./routes/interview"
import { interviewSessionsRouter } from "./routes/interview-session"
import { resultsRouter } from "./routes/results"

export const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // "http://localhost:3000"
    credentials: true, // required for cross-origin cookies
  })
)

app.use(morgan("dev"))

app.all("/api/auth/*splat", toNodeHandler(auth))
app.use(json())

app.use("/api/health", healthRouter)
app.use("/api/analyze", analyzeRouter)
app.use("/api/results", resultsRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/interview-sessions", interviewSessionsRouter)

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = (err as { status?: number }).status ?? 500
  const message = err instanceof Error ? err.message : "Internal server error"
  res.status(status).json({ code: "INTERNAL_ERROR", message })
}

app.use(errorHandler)
