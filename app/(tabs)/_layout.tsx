import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "black" }}>
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ color }) => <FontAwesome name="home" color={color} /> }} />
      <Tabs.Screen name="account" options={{ tabBarIcon: ({ color }) => <FontAwesome name="user" color={color} /> }} />
    </Tabs>
  )
}
