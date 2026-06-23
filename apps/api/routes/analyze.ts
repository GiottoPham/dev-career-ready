import { Router } from "express"

export const analyzeRouter = Router()

analyzeRouter.post("/", (req, res) => {
  const { jobDescription, skills } = req.body
})
