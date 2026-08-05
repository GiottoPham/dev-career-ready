import { Router } from "express"

import { getRedisStatus } from "../lib/redis"

export const healthRouter = Router()

healthRouter.get("/", (_, res) => {
  res.json({ status: "ok", message: "Health checked ok", redis: getRedisStatus() })
})
