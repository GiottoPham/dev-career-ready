import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_PROJECT_URL!, process.env.SUPABASE_API_KEY!)

export const uploadMiniFile = async ({
  buffer,
  name,
  bucketName,
  contentType = "application/pdf",
}: {
  buffer: Buffer
  name: string
  bucketName: string
  contentType?: string
}) => {
  const timestamp = Date.now()
  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const path = `${timestamp}-${safeName}`

  const { error } = await supabase.storage.from(bucketName).upload(path, buffer, {
    contentType,
    upsert: false,
  })

  if (error) {
    throw new Error(`Failed to upload file ${path}: ${error.message}`)
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(path)

  return data.publicUrl
}
