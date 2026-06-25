import { toNodeHandler } from "better-auth/node"
import cors from "cors"
import express, { json } from "express"
import morgan from "morgan"

import { auth } from "./lib/auth"
import { analyzeRouter } from "./routes/analyze"
import { healthRouter } from "./routes/health"

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
