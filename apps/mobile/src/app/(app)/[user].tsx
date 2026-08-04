import { useLocalSearchParams } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

export default function Profile() {
  const { user } = useLocalSearchParams<{ user: string }>()
  const handle = user?.replace(/^@/, "")

  return (
    <View style={styles.container}>
      <Text>{handle}&apos;s Profile</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
})
