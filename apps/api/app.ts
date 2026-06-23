import cors from "cors"
import express, { json } from "express"
import morgan from "morgan"

import { healthRouter } from "./routes/health"

export const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(json())

app.use("/health", healthRouter)
