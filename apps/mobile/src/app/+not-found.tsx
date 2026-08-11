import { Link } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Text>404</Text>
      <Link href="/">Go to Home</Link>
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
