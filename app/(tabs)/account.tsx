import { Stack } from "expo-router";
import { useContext } from "react";
import { Text } from "react-native";
import { ThemeContext } from "~/context/ThemeContext";

export default function Account() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <>
      <Stack.Screen
        options=
        {{
          headerBackVisible: false,
          headerLeft: undefined,
          title: "Account",
          headerTitleStyle: { fontFamily: "WorkSans-Bold" },
          headerStyle: { backgroundColor: darkMode ? "#1b1b1b" : "#fff" },
          headerTintColor: darkMode ? "#fff" : "#000",
        }}
      />
      <Text>Account page</Text>
    </>
  )
}
