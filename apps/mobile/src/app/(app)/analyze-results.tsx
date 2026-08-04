import type { AnalysisResultResponse } from "@packages/shared"
import { useLocalSearchParams } from "expo-router"
import { useQuery } from "@tanstack/react-query"
import { ActivityIndicator, ScrollView, Text, View } from "react-native"

import { api } from "@/api/client"

const STATUS_LABELS: Record<string, string> = {
  pending: "Queued…",
  validating: "Validating job description…",
  uploading: "Uploading documents…",
  analyzing: "Analyzing skill gap…",
}

export default function AnalyzeResults() {
  const { resultId } = useLocalSearchParams<{ resultId: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ["analyze-result", resultId],
    queryFn: () => api<AnalysisResultResponse>(`/api/results/${resultId}`),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === "completed" || status === "failed" ? false : 1500
    },
  })

  if (isLoading || !data) {
    return (
      <View className="flex-1 items-center justify-center gap-y-4 bg-background">
        <ActivityIndicator />
      </View>
    )
  }

  if (data.status === "failed") {
    return (
      <View className="flex-1 items-center justify-center gap-y-2 bg-background px-6">
        <Text className="text-lg font-bold text-destructive">Analysis failed</Text>
        <Text className="text-center text-muted-foreground">{data.error ?? "Please try again."}</Text>
      </View>
    )
  }

  if (data.status !== "completed" || !data.result) {
    return (
      <View className="flex-1 items-center justify-center gap-y-4 bg-background">
        <ActivityIndicator />
        <Text className="text-muted-foreground">{STATUS_LABELS[data.status] ?? "Working…"}</Text>
      </View>
    )
  }

  const { position, company, matchedSkills, missingSkills, cvTips } = data.result

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-y-6 p-4">
      <View>
        <Text className="text-lg font-bold text-foreground">{position}</Text>
        <Text className="text-muted-foreground">{company}</Text>
      </View>

      <View className="gap-y-2">
        <Text className="text-xs tracking-widest text-muted-foreground uppercase">Matched Skills</Text>
        <View className="flex-row flex-wrap gap-2">
          {matchedSkills.map((skill) => (
            <Text key={skill} className="rounded-full border border-border bg-card px-3 py-1 text-sm text-foreground">
              {skill}
            </Text>
          ))}
        </View>
      </View>

      <View className="gap-y-2">
        <Text className="text-xs tracking-widest text-muted-foreground uppercase">Missing Skills</Text>
        <View className="gap-y-1">
          {missingSkills.map(({ skill, priority }) => (
            <View key={skill} className="flex-row items-center justify-between rounded-md border border-border bg-card px-3 py-2">
              <Text className="text-foreground">{skill}</Text>
              <Text className="text-xs text-muted-foreground uppercase">{priority}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="gap-y-2">
        <Text className="text-xs tracking-widest text-muted-foreground uppercase">CV Tips</Text>
        <View className="gap-y-2">
          {cvTips.map((tip) => (
            <Text key={tip} className="text-foreground">
              • {tip}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}
