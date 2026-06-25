import { Router } from "express"

import { requireAuth } from "../middlewares/requireAuth"

export const analyzeRouter = Router()

analyzeRouter.use(requireAuth)

analyzeRouter.post("/", (req, res) => {
  console.log("hoho", req.body)
  return res.json({ status: "ok" })
})
