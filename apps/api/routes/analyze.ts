import { Router } from "express"

export const analyzeRouter = Router()

analyzeRouter.post("/", (req) => {
  const { _jobDescription, _skills } = req.body
})
