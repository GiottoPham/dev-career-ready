import { GoogleGenAI } from "@google/genai"
import type { AnalyzeResponse } from "@packages/shared"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const GENERATE_SYSTEM_PROMPT = (
  language: "vn" | "en"
) => `You are a career coaching expert specializing in tech job market analysis.
Given a job description and a candidate's CV text or skills list, perform a skill analysis.

You MUST respond with valid JSON matching this exact structure:
{
  "position": "Senior Frontend Developer" or undefined,
  "company": "Ed Tech" or undefined,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "cvTips": [
    "Add 'CI/CD' to your CV — the JD mentions it 3 times and you have DevOps experience.",
    "Reframe 'built APIs' as 'designed RESTful APIs with Express' to match their language."
  ]
}

Rules:
- position: position which candidate applies to, if no info return undefined,
- company: name of the company where candidate applies to, if no info return undefined,
- matchedSkills: skills the candidate already has that match the job requirements
- missingSkills: skills required by the job that the candidate lacks, ordered by priority (most critical first)
- cvTips: 2-5 short, actionable suggestions to make the CV better match this specific JD
  - Focus on wording improvements, missing keywords, and reframing existing experience
  - Each tip should be one sentence, specific and immediately actionable
  - Only include tips if the CV text is available; omit the field if only a skills list was provided
  - Write as ${language === "en" ? "English" : "Vietnamese"}
- Be specific with skill names (e.g. "React" not "frontend framework")
- Only output the JSON object, no markdown fences or extra text`

export async function analyzeSkillGap(
  jobDescription: string,
  cvText?: string,
  skills?: string[],
  language?: "vn" | "en"
): Promise<AnalyzeResponse> {
  const userParts: string[] = []

  userParts.push(`## Job Description\n${jobDescription}`)

  if (cvText) {
    userParts.push(`## Candidate CV\n${cvText}`)
  }

  if (skills && skills.length > 0) {
    userParts.push(`## Candidate Skills\n${skills.join(", ")}`)
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: userParts.join("\n\n"),
    config: {
      systemInstruction: GENERATE_SYSTEM_PROMPT(language ?? "en"),
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  })

  const content = response.text
  if (!content) {
    throw new Error("Empty response from AI model")
  }

  return JSON.parse(content) as AnalyzeResponse
}
