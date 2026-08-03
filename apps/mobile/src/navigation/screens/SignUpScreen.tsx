import { useState } from "react"
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native"

import { authClient } from "../../lib/auth-client"

export function SignUpScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string>()
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async () => {
    setError(undefined)
    setIsPending(true)
    const { error: signUpError } = await authClient.signUp.email({ name, email, password })
    setIsPending(false)
    if (signUpError) {
      setError(signUpError.message ?? "Something went wrong. Please try again.")
    }
  }

  return (
    <View className="flex-1 justify-center gap-y-4 bg-background px-6">
      <Text className="mb-4 text-2xl font-bold text-foreground">Create your account</Text>
      <TextInput
        autoCapitalize="words"
        autoComplete="name"
        placeholder="Name"
        placeholderTextColor="#78716c"
        value={name}
        onChangeText={setName}
        className="rounded-md border border-border bg-card px-4 py-3 text-foreground"
      />
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
        autoComplete="password-new"
        secureTextEntry
        placeholder="Password"
        placeholderTextColor="#78716c"
        value={password}
        onChangeText={setPassword}
        className="rounded-md border border-border bg-card px-4 py-3 text-foreground"
      />
      {error ? <Text className="text-destructive">{error}</Text> : null}
      <Pressable
        disabled={isPending || !name || !email || !password}
        onPress={handleSubmit}
        className="items-center rounded-md bg-primary py-3 disabled:opacity-50"
      >
        {isPending ? <ActivityIndicator /> : <Text className="font-semibold text-primary-foreground">Sign Up</Text>}
      </Pressable>
    </View>
  )
}
