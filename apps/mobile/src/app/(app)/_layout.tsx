import { useRouter } from "expo-router"
import { Stack } from "expo-router/stack"
import { Pressable, Text } from "react-native"

export default function AppLayout() {
  const router = useRouter()

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="analyze-results" options={{ title: "Results" }} />
      <Stack.Screen name="[user]" />
      <Stack.Screen
        name="settings"
        options={{
          presentation: "modal",
          headerRight: () => (
            <Pressable onPress={() => router.back()}>
              <Text className="text-primary">Close</Text>
            </Pressable>
          ),
        }}
      />
    </Stack>
  )
}
