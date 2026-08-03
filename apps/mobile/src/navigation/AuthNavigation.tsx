import { createStaticNavigation } from "@react-navigation/native"
import { createNativeStackNavigator, createNativeStackScreen } from "@react-navigation/native-stack"

import { SignInScreen } from "./screens/SignInScreen"
import { SignUpScreen } from "./screens/SignUpScreen"

const AuthStack = createNativeStackNavigator({
  screens: {
    SignIn: createNativeStackScreen({
      screen: SignInScreen,
      options: {
        headerShown: false,
      },
    }),
    SignUp: createNativeStackScreen({
      screen: SignUpScreen,
      options: {
        title: "Sign Up",
      },
    }),
  },
})

export const AuthNavigation = createStaticNavigation(AuthStack)
