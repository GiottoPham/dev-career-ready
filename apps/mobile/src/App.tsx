import "../global.css"

import { Assets as NavigationAssets } from "@react-navigation/elements"
import { DarkTheme, DefaultTheme } from "@react-navigation/native"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Asset } from "expo-asset"
import { createURL } from "expo-linking"
import * as SplashScreen from "expo-splash-screen"
import { useColorScheme } from "react-native"

import { authClient } from "./lib/auth-client"
import { AppNavigation } from "./navigation/AppNavigation"
import { AuthNavigation } from "./navigation/AuthNavigation"

Asset.loadAsync([...NavigationAssets, require("./assets/newspaper.png"), require("./assets/bell.png")])

SplashScreen.preventAutoHideAsync()

const linking = {
  enabled: "auto" as const,
  prefixes: [createURL("/")],
}

const queryClient = new QueryClient()

export function App() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return null
  }

  const Navigation = session ? AppNavigation : AuthNavigation

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation
        theme={theme}
        linking={linking}
        onReady={() => {
          SplashScreen.hideAsync()
        }}
      />
    </QueryClientProvider>
  )
}
