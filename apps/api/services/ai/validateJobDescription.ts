import { GoogleGenAI } from "@google/genai"
import type { Language } from "@packages/shared"

import { assertGeminiSlot } from "../../lib/gemini-rate-limiter"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const generateSystemPrompt = (
  language: Language
) => `You are a strict classifier that checks whether a piece of text is a real job description (JD).

A job description typically mentions a role/position, responsibilities, and/or required skills or qualifications.
Text that is a CV/resume, a random paragraph, spam, or unrelated content is NOT a job description.

You MUST respond with valid JSON matching this exact structure:
{
  "isJobDescription": boolean,
  "reason": "short, user-facing explanation, only present when isJobDescription is false",
  "position": "the job title/position extracted from the JD, or null if not found",
  "company": "the company name extracted from the JD, or null if not found"
}

Rules:
- reason: 1 short sentence, written in ${language === "en" ? "English" : "Vietnamese"}, explaining what the text looks like instead (e.g. "This looks like a CV, not a job description.")
- position and company: only populate when isJobDescription is true; set to null otherwise
- Only output the JSON object, no markdown fences or extra text`

export const validateJobDescription = async ({
  text,
  language,
}: {
  text: string
  language?: Language
}): Promise<{ isJobDescription: boolean; reason?: string; position?: string; company?: string }> => {
  await assertGeminiSlot()

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: text,
    config: {
      systemInstruction: generateSystemPrompt(language ?? "en"),
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  })

  const content = response.text
  if (!content) {
    throw new Error("Empty response from AI model")
  }

  return JSON.parse(content) as { isJobDescription: boolean; reason?: string; position?: string; company?: string }
}
