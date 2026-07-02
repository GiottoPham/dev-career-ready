import mammoth from "mammoth"

export const extractTextFromDocx = async (buffer: Buffer) => {
  const { value } = await mammoth.extractRawText({ buffer })
  return value.trim()
}
