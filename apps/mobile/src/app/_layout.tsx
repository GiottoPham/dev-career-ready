import "../../global.css"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router/react-navigation"
import { Stack } from "expo-router/stack"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { useColorScheme } from "react-native"

import { authClient } from "@/lib/auth-client"

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending) {
      SplashScreen.hideAsync()
    }
  }, [isPending])

  if (isPending) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!!session}>
            <Stack.Screen name="(app)" />
          </Stack.Protected>
          <Stack.Protected guard={!session}>
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" options={{ headerShown: true, title: "Sign Up" }} />
          </Stack.Protected>
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
