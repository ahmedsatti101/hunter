import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { PlatformPressable } from "@react-navigation/elements";
import { Tabs } from "expo-router";
import { useContext } from "react";
import { ThemeContext } from "~/context/ThemeContext";

export default function TabLayout() {
  const { darkMode } = useContext(ThemeContext);
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: darkMode ? "white" : "black",
      tabBarStyle: { backgroundColor: darkMode ? "#212121" : "#fff", borderTopWidth: darkMode ? 0 : undefined },
      tabBarShowLabel: false, tabBarButton: (props) => (
        <PlatformPressable
          {...props}
          pressColor="transparent" //remove ripple effect for android
          pressOpacity={0.3} //remove ripple effect for ios
        />
      )
    }}>
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ color }) => <FontAwesome name="home" color={color} size={30} /> }} />
      <Tabs.Screen name="account" options={{ tabBarIcon: ({ color }) => <MaterialIcons name="account-circle" color={color} size={30} /> }} />
    </Tabs>
  )
}
