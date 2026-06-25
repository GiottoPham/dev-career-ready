import { PDFParse } from "pdf-parse"

export const extractTextFromPDF = async (buffer: Buffer) => {
  const parser = new PDFParse({ data: buffer })
  const data = await parser.getText()
  return data.text.trim()
}
