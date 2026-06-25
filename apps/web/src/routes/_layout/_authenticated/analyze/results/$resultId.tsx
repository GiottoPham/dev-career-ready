import { type AnalysisResultResponse } from "@packages/shared"
import { createFileRoute } from "@tanstack/react-router"

import { Result } from "./-Result"
import { ResultSkeleton } from "./-ResultSkeleton"

export const Route = createFileRoute("/_layout/_authenticated/analyze/results/$resultId")({
  component: RouteComponent,
})

function RouteComponent() {
  const data = MOCK_RESULT

  if (data.status !== "completed" || !data.result) {
    return <ResultSkeleton status={data.status} />
  }

  return <Result result={data.result} />
}

const MOCK_RESULT: AnalysisResultResponse = {
  id: 10,
  status: "analyzing",
  error: null,
  result: {
    position: "Senior Frontend Developer",
    company: "Acme Corp",
    matchedSkills: ["React", "TypeScript", "Tailwind CSS", "Git", "REST APIs"],
    missingSkills: [
      { skill: "GraphQL", priority: "high" },
      { skill: "Next.js", priority: "high" },
      { skill: "Testing (Vitest)", priority: "medium" },
      { skill: "CI/CD", priority: "medium" },
      { skill: "Docker", priority: "low" },
      { skill: "AWS S3", priority: "low" },
      { skill: "Figma", priority: "low" },
    ],
    cvTips: [
      "Add 'CI/CD' to your CV — the JD mentions it 3 times and you have DevOps experience.",
      "Reframe 'built APIs' as 'designed RESTful APIs with Express' to match their language.",
      "Highlight your TypeScript experience — the JD lists it as a 'must have.'",
      "Move your React projects to the top of your experience section — it's the primary requirement.",
      "Add a 'Testing' section — even unit test experience signals quality awareness.",
    ],
  },
}
