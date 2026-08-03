import { useNavigation } from "@react-navigation/native"
import * as DocumentPicker from "expo-document-picker"
import { useState } from "react"
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native"

import { api, ApiError } from "../../api/client"

type PickedFile = { uri: string; name: string; mimeType?: string }

const toFormFile = (file: PickedFile) =>
  ({ uri: file.uri, name: file.name, type: file.mimeType ?? "application/pdf" }) as unknown as Blob

export function AnalyzeScreen() {
  const navigation = useNavigation()
  const [jdMode, setJdMode] = useState<"upload" | "manual">("manual")
  const [jdText, setJdText] = useState("")
  const [jdFile, setJdFile] = useState<PickedFile>()
  const [cvMode, setCvMode] = useState<"upload" | "manual">("manual")
  const [skillsText, setSkillsText] = useState("")
  const [cvFile, setCvFile] = useState<PickedFile>()
  const [position, setPosition] = useState("")
  const [company, setCompany] = useState("")
  const [isPending, setIsPending] = useState(false)

  const pickJdFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    })
    const asset = result.assets?.[0]
    if (asset) {
      setJdFile({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType })
    }
  }

  const pickCvFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" })
    const asset = result.assets?.[0]
    if (asset) {
      setCvFile({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType })
    }
  }

  const isFilledInJD = jdMode === "upload" ? !!jdFile : !!jdText
  const isFilledInCv = cvMode === "upload" ? !!cvFile : !!skillsText

  const handleSubmit = async () => {
    setIsPending(true)
    try {
      const formData = new FormData()
      if (jdMode === "upload" && jdFile) {
        formData.append("jdFile", toFormFile(jdFile))
      } else {
        formData.append("jobDescription", jdText)
      }
      formData.append("language", "en")
      if (position) {
        formData.append("position", position)
      }
      if (company) {
        formData.append("company", company)
      }
      if (cvMode === "upload" && cvFile) {
        formData.append("cvFile", toFormFile(cvFile))
      } else if (skillsText) {
        const skills = skillsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((value) => ({ value }))
        formData.append("skills", JSON.stringify(skills))
      }
      const { resultId } = await api<{ resultId: number }>("/api/analyze", { method: "POST", body: formData })
      navigation.navigate("AnalyzeResults", { resultId })
    } catch (e) {
      Alert.alert("Error", e instanceof ApiError ? e.message : "Something went wrong. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-y-6 p-4">
      <View className="gap-y-2">
        <Text className="text-xs tracking-widest text-muted-foreground uppercase">Job Description</Text>
        <View className="flex-row gap-x-2">
          <ToggleButton label="Enter manually" active={jdMode === "manual"} onPress={() => setJdMode("manual")} />
          <ToggleButton label="Upload" active={jdMode === "upload"} onPress={() => setJdMode("upload")} />
        </View>
        {jdMode === "manual" ? (
          <TextInput
            multiline
            placeholder="Paste the job description here"
            placeholderTextColor="#78716c"
            value={jdText}
            onChangeText={setJdText}
            className="min-h-32 rounded-md border border-border bg-card px-4 py-3 text-foreground"
          />
        ) : (
          <Pressable onPress={pickJdFile} className="items-center rounded-md border border-dashed border-border bg-card py-6">
            <Text className="text-muted-foreground">{jdFile ? jdFile.name : "Tap to select a PDF or DOCX"}</Text>
          </Pressable>
        )}
        <TextInput
          placeholder="Position (optional)"
          placeholderTextColor="#78716c"
          value={position}
          onChangeText={setPosition}
          className="rounded-md border border-border bg-card px-4 py-3 text-foreground"
        />
        <TextInput
          placeholder="Company (optional)"
          placeholderTextColor="#78716c"
          value={company}
          onChangeText={setCompany}
          className="rounded-md border border-border bg-card px-4 py-3 text-foreground"
        />
      </View>

      <View className="gap-y-2">
        <Text className="text-xs tracking-widest text-muted-foreground uppercase">Your CV</Text>
        <View className="flex-row gap-x-2">
          <ToggleButton label="Upload" active={cvMode === "upload"} onPress={() => setCvMode("upload")} />
          <ToggleButton label="Enter manually" active={cvMode === "manual"} onPress={() => setCvMode("manual")} />
        </View>
        {cvMode === "upload" ? (
          <Pressable onPress={pickCvFile} className="items-center rounded-md border border-dashed border-border bg-card py-6">
            <Text className="text-muted-foreground">{cvFile ? cvFile.name : "Tap to select a PDF"}</Text>
          </Pressable>
        ) : (
          <TextInput
            placeholder="Type your skills, separated by commas"
            placeholderTextColor="#78716c"
            value={skillsText}
            onChangeText={setSkillsText}
            className="rounded-md border border-border bg-card px-4 py-3 text-foreground"
          />
        )}
      </View>

      <Pressable
        disabled={!isFilledInJD || !isFilledInCv || isPending}
        onPress={handleSubmit}
        className="items-center rounded-md bg-primary py-3 disabled:opacity-50"
      >
        {isPending ? <ActivityIndicator /> : <Text className="font-semibold text-primary-foreground">Analyze</Text>}
      </Pressable>
    </ScrollView>
  )
}

function ToggleButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center rounded-md border border-border py-2 ${active ? "bg-primary" : "bg-card"}`}
    >
      <Text className={active ? "text-primary-foreground" : "text-foreground"}>{label}</Text>
    </Pressable>
  )
}
