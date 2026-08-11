import * as DocumentPicker from "expo-document-picker"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native"
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { api, ApiError } from "@/api/client"
import { HEADER_HEIGHT, ScrollFadeHeader } from "@/components/scroll-fade-header"

type PickedFile = { uri: string; name: string; mimeType?: string }

const toFormFile = (file: PickedFile) =>
  ({ uri: file.uri, name: file.name, type: file.mimeType ?? "application/pdf" }) as unknown as Blob

export default function Analyze() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const scrollY = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })
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
      router.push({ pathname: "/analyze-results", params: { resultId: String(resultId) } })
    } catch (e) {
      Alert.alert("Error", e instanceof ApiError ? e.message : "Something went wrong. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <View className="bg-background flex-1">
      <ScrollFadeHeader title="Analyze" scrollY={scrollY} />
      <Animated.ScrollView
        className="flex-1"
        contentContainerClassName="gap-y-6 px-4 pb-4"
        contentContainerStyle={{ paddingTop: insets.top + HEADER_HEIGHT + 16 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View className="gap-y-2">
          <Text className="text-muted-foreground text-xs tracking-widest uppercase">Job Description</Text>
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
              className="border-border bg-card text-foreground min-h-32 rounded-md border px-4 py-3"
            />
          ) : (
            <Pressable
              onPress={pickJdFile}
              className="border-border bg-card items-center rounded-md border border-dashed py-6"
            >
              <Text className="text-muted-foreground">{jdFile ? jdFile.name : "Tap to select a PDF or DOCX"}</Text>
            </Pressable>
          )}
          <TextInput
            placeholder="Position (optional)"
            placeholderTextColor="#78716c"
            value={position}
            onChangeText={setPosition}
            className="border-border bg-card text-foreground rounded-md border px-4 py-3"
          />
          <TextInput
            placeholder="Company (optional)"
            placeholderTextColor="#78716c"
            value={company}
            onChangeText={setCompany}
            className="border-border bg-card text-foreground rounded-md border px-4 py-3"
          />
        </View>

        <View className="gap-y-2">
          <Text className="text-muted-foreground text-xs tracking-widest uppercase">Your CV</Text>
          <View className="flex-row gap-x-2">
            <ToggleButton label="Upload" active={cvMode === "upload"} onPress={() => setCvMode("upload")} />
            <ToggleButton label="Enter manually" active={cvMode === "manual"} onPress={() => setCvMode("manual")} />
          </View>
          {cvMode === "upload" ? (
            <Pressable
              onPress={pickCvFile}
              className="border-border bg-card items-center rounded-md border border-dashed py-6"
            >
              <Text className="text-muted-foreground">{cvFile ? cvFile.name : "Tap to select a PDF"}</Text>
            </Pressable>
          ) : (
            <TextInput
              placeholder="Type your skills, separated by commas"
              placeholderTextColor="#78716c"
              value={skillsText}
              onChangeText={setSkillsText}
              className="border-border bg-card text-foreground rounded-md border px-4 py-3"
            />
          )}
        </View>

        <Pressable
          disabled={!isFilledInJD || !isFilledInCv || isPending}
          onPress={handleSubmit}
          className="bg-primary items-center rounded-md py-3 disabled:opacity-50"
        >
          {isPending ? <ActivityIndicator /> : <Text className="text-primary-foreground font-semibold">Analyze</Text>}
        </Pressable>
      </Animated.ScrollView>
    </View>
  )
}

function ToggleButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`border-border flex-1 items-center rounded-md border py-2 ${active ? "bg-primary" : "bg-card"}`}
    >
      <Text className={active ? "text-primary-foreground" : "text-foreground"}>{label}</Text>
    </Pressable>
  )
}
