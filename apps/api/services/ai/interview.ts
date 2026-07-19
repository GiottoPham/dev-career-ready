import { ApiError, GoogleGenAI } from "@google/genai"
import type { FocusArea, InterviewMode, InterviewSummary, Language } from "@packages/shared"

import { assertGeminiSlot, GeminiRateLimitError } from "../../lib/gemini-rate-limiter"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const projectSystemPrompt = (difficulty: string, focusArea: string, language: Language) => {
  const focusInstruction =
    focusArea === "matched"
      ? "Focus on projects that demonstrate skills matching the job description."
      : focusArea === "gaps"
        ? "Ask hypothetical project-based questions about technologies the candidate lacks — how they would approach building something using those tools for the first time."
        : "Ask about any projects in the candidate's CV."

  return `You are a senior technical interviewer. Ask ONE focused question at a time about the candidate's experience and projects.

${focusInstruction}

- Start by asking about the most relevant or complex project.
- Every follow-up must directly probe what the candidate just said:
  technology mentioned → ask why they chose it or what problems they hit
  challenge mentioned → ask how they solved it and what they learned
  decision mentioned → ask what alternatives they considered
- Never repeat a topic already covered.
- Difficulty: ${difficulty}. easy: what/how. medium: add why and trade-offs. hard: edge cases, scalability, architecture.
- Write as ${language === "en" ? "English" : "Vietnamese"} but keep any techinal vocabularies as it should be

Respond ONLY with valid JSON: { "question": "your next question here" }`
}

const technicalSystemPrompt = (difficulty: string, focusArea: string, language: Language) => {
  const focusInstruction =
    focusArea === "matched"
      ? "Quiz the candidate on skills they already have — help them articulate and deepen existing knowledge."
      : focusArea === "gaps"
        ? "Quiz the candidate on technologies they are missing — probe their understanding and surface gaps."
        : "Cover the full range of skills relevant to the job description, both existing and missing."

  return `You are a senior technical interviewer conducting a knowledge-based quiz. Ask ONE technical question at a time.

${focusInstruction}

- Follow up on the candidate's last answer — probe deeper or move to a related concept.
- Never repeat a topic already covered.
- Difficulty: ${difficulty}. easy: definitions/usage. medium: implementation/trade-offs. hard: internals/edge cases/system design.
- Write as ${language === "en" ? "English" : "Vietnamese"} but keep any techinal vocabularies as it should be

Respond ONLY with valid JSON: { "question": "your next question here" }`
}

type Turn = { question: string; answer: string }

export const generateNextQuestion = async ({
  cvText,
  matchedSkills,
  missingSkills,
  jobDescription,
  history,
  difficulty,
  mode,
  focusArea,
  language = "en",
}: {
  cvText?: string
  matchedSkills?: string[]
  missingSkills?: string[]
  jobDescription?: string
  history: Turn[]
  difficulty: string
  mode: InterviewMode
  focusArea: FocusArea
  language?: Language
}): Promise<string> => {
  const parts: string[] = []

  if (mode === "project" && cvText) {
    parts.push(`## Candidate CV\n${cvText}`)
  }

  if (matchedSkills && matchedSkills.length > 0) {
    parts.push(`## Candidate Matched Skills\n${matchedSkills.join(", ")}`)
  }

  if (missingSkills && missingSkills.length > 0) {
    parts.push(`## Candidate Gap Skills\n${missingSkills.join(", ")}`)
  }

  if (jobDescription) {
    parts.push(`## Job Description\n${jobDescription}`)
  }

  if (history.length > 0) {
    const historyText = history.map((t, i) => `Q${i + 1}: ${t.question}\nA${i + 1}: ${t.answer}`).join("\n\n")
    parts.push(`## Interview so far\n${historyText}`)
    parts.push("Generate the next follow-up question based on the candidate's last answer.")
  } else {
    parts.push(
      mode === "project"
        ? "Start the interview. Ask about a relevant project from the candidate's CV."
        : "Start the quiz. Ask a technical question about one of the skills listed."
    )
  }

  const systemPrompt =
    mode === "project"
      ? projectSystemPrompt(difficulty, focusArea, language)
      : technicalSystemPrompt(difficulty, focusArea, language)

  const response = await withGeminiRetry(() =>
    ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: parts.join("\n\n"),
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    })
  )

  const content = response.text

  if (!content) {
    throw new Error("Empty response from AI model")
  }

  const parsed = JSON.parse(content) as { question: string }

  return parsed.question
}

export const generateSummary = async ({
  history,
  mode,
}: {
  history: Turn[]
  mode: InterviewMode
}): Promise<InterviewSummary> => {
  const historyText = history.map((t, i) => `Q${i + 1}: ${t.question}\nA${i + 1}: ${t.answer}`).join("\n\n")

  const modeContext =
    mode === "project"
      ? "This was a project deep-dive interview. Assess how well the candidate articulated their experience and technical decisions."
      : "This was a technical knowledge quiz. Assess the candidate's depth of understanding and ability to handle follow-ups on specific technologies."

  const systemPrompt = `You are a senior technical interviewer. ${modeContext}

Respond ONLY with valid JSON:
{
  "feedback": "4-5 sentence overall assessment of the candidate's performance",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["area to improve 1", "area to improve 2"],
  "score": 75
}

List at least 5 items for strengths
List at least 5 items for improvements
score is 0-100. Base it on clarity, depth, technical accuracy, and ability to handle follow-ups.`
  const contents = `## Full Interview Transcript\n${historyText}`

  const response = await withGeminiRetry(() =>
    ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    })
  )

  const content = response.text

  if (!content) {
    throw new Error("Empty response from AI model")
  }

  return JSON.parse(content) as InterviewSummary
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const withGeminiRetry = async <T>(fn: () => Promise<T>): Promise<T> => {
  const backoffMs = [300, 900]
  for (let attempt = 0; ; attempt++) {
    try {
      await assertGeminiSlot()
      return await fn()
    } catch (e) {
      const isRetryable =
        e instanceof GeminiRateLimitError || (e instanceof ApiError && (e.status === 429 || e.status >= 500))
      if (!isRetryable || attempt >= backoffMs.length) {
        throw e
      }
      await sleep(backoffMs[attempt]!)
    }
  }
}
