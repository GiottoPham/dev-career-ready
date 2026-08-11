import { NativeTabs } from "expo-router/unstable-native-tabs"

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Analyze</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require("@/assets/newspaper.png")} renderingMode="template" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="updates">
        <NativeTabs.Trigger.Label>Updates</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require("@/assets/bell.png")} renderingMode="template" />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
