import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native"

import { authClient } from "../../lib/auth-client"

export function SignInScreen() {
  const navigation = useNavigation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string>()
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async () => {
    setError(undefined)
    setIsPending(true)
    const { error: signInError } = await authClient.signIn.email({ email, password })
    setIsPending(false)
    if (signInError) {
      setError(signInError.message ?? "Something went wrong. Please try again.")
    }
  }

  return (
    <View className="flex-1 justify-center gap-y-4 bg-background px-6">
      <Text className="mb-4 text-2xl font-bold text-foreground">Sign in to CareerReady</Text>
      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor="#78716c"
        value={email}
        onChangeText={setEmail}
        className="rounded-md border border-border bg-card px-4 py-3 text-foreground"
      />
      <TextInput
        autoCapitalize="none"
        autoComplete="password"
        secureTextEntry
        placeholder="Password"
        placeholderTextColor="#78716c"
        value={password}
        onChangeText={setPassword}
        className="rounded-md border border-border bg-card px-4 py-3 text-foreground"
      />
      {error ? <Text className="text-destructive">{error}</Text> : null}
      <Pressable
        disabled={isPending || !email || !password}
        onPress={handleSubmit}
        className="items-center rounded-md bg-primary py-3 disabled:opacity-50"
      >
        {isPending ? <ActivityIndicator /> : <Text className="font-semibold text-primary-foreground">Sign In</Text>}
      </Pressable>
      <Pressable onPress={() => navigation.navigate("SignUp" as never)}>
        <Text className="text-center text-muted-foreground">
          Don&apos;t have an account? <Text className="text-primary">Sign up</Text>
        </Text>
      </Pressable>
    </View>
  )
}
