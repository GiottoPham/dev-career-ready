import { useRouter } from "expo-router"
import { CaretLeftIcon } from "phosphor-react-native"
import { useState } from "react"
import { Pressable, Text } from "react-native"
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const HEADER_HEIGHT = 48
const FADE_DISTANCE = 80

export function ScrollFadeHeader({
  title,
  scrollY,
  showBack,
}: {
  title: string
  scrollY: SharedValue<number>
  showBack?: boolean
}) {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [interactive, setInteractive] = useState(true)

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, FADE_DISTANCE], [1, 0], Extrapolation.CLAMP),
  }))

  useAnimatedReaction(
    () => scrollY.value < FADE_DISTANCE,
    (isVisible, wasVisible) => {
      if (isVisible !== wasVisible) {
        runOnJS(setInteractive)(isVisible)
      }
    }
  )

  return (
    <Animated.View
      pointerEvents={interactive ? "box-none" : "none"}
      style={[{ paddingTop: insets.top, height: insets.top + HEADER_HEIGHT }, animatedStyle]}
      className="border-border bg-background absolute inset-x-0 top-0 z-10 flex-row items-center border-b px-4"
    >
      {showBack && (
        <Pressable onPress={() => router.back()} hitSlop={8} className="mr-2">
          <CaretLeftIcon size={20} color="#fafaf9" />
        </Pressable>
      )}
      <Text className="text-foreground text-base font-semibold">{title}</Text>
    </Animated.View>
  )
}
