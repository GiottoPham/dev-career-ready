import type { AnalysisResultResponse } from "@packages/shared"
import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { ActivityIndicator, Text, View } from "react-native"
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { api } from "@/api/client"
import { HEADER_HEIGHT, ScrollFadeHeader } from "@/components/scroll-fade-header"

const STATUS_LABELS: Record<string, string> = {
  pending: "Queued…",
  validating: "Validating job description…",
  uploading: "Uploading documents…",
  analyzing: "Analyzing skill gap…",
}

export default function AnalyzeResults() {
  const { resultId } = useLocalSearchParams<{ resultId: string }>()
  const insets = useSafeAreaInsets()
  const scrollY = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })

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
      <View className="bg-background flex-1 items-center justify-center gap-y-4">
        <ScrollFadeHeader title="Results" scrollY={scrollY} showBack />
        <ActivityIndicator />
      </View>
    )
  }

  if (data.status === "failed") {
    return (
      <View className="bg-background flex-1 items-center justify-center gap-y-2 px-6">
        <ScrollFadeHeader title="Results" scrollY={scrollY} showBack />
        <Text className="text-destructive text-lg font-bold">Analysis failed</Text>
        <Text className="text-muted-foreground text-center">{data.error ?? "Please try again."}</Text>
      </View>
    )
  }

  if (data.status !== "completed" || !data.result) {
    return (
      <View className="bg-background flex-1 items-center justify-center gap-y-4">
        <ScrollFadeHeader title="Results" scrollY={scrollY} showBack />
        <ActivityIndicator />
        <Text className="text-muted-foreground">{STATUS_LABELS[data.status] ?? "Working…"}</Text>
      </View>
    )
  }

  const { position, company, matchedSkills, missingSkills, cvTips } = data.result

  return (
    <View className="bg-background flex-1">
      <ScrollFadeHeader title="Results" scrollY={scrollY} showBack />
      <Animated.ScrollView
        className="flex-1"
        contentContainerClassName="gap-y-6 px-4 pb-4"
        contentContainerStyle={{ paddingTop: insets.top + HEADER_HEIGHT + 16 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View>
          <Text className="text-foreground text-lg font-bold">{position}</Text>
          <Text className="text-muted-foreground">{company}</Text>
        </View>

        <View className="gap-y-2">
          <Text className="text-muted-foreground text-xs tracking-widest uppercase">Matched Skills</Text>
          <View className="flex-row flex-wrap gap-2">
            {matchedSkills.map((skill) => (
              <Text key={skill} className="border-border bg-card text-foreground rounded-full border px-3 py-1 text-sm">
                {skill}
              </Text>
            ))}
          </View>
        </View>

        <View className="gap-y-2">
          <Text className="text-muted-foreground text-xs tracking-widest uppercase">Missing Skills</Text>
          <View className="gap-y-1">
            {missingSkills.map(({ skill, priority }) => (
              <View
                key={skill}
                className="border-border bg-card flex-row items-center justify-between rounded-md border px-3 py-2"
              >
                <Text className="text-foreground">{skill}</Text>
                <Text className="text-muted-foreground text-xs uppercase">{priority}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="gap-y-2">
          <Text className="text-muted-foreground text-xs tracking-widest uppercase">CV Tips</Text>
          <View className="gap-y-2">
            {cvTips.map((tip) => (
              <Text key={tip} className="text-foreground">
                • {tip}
              </Text>
            ))}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  )
}
