import { Stack, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { ThemeContext } from "~/context/ThemeContext";

export default function EntryScreen() {
  const entryId = useLocalSearchParams<{ id: string }>();
  const mediumFont = "WorkSans-Medium";
  const boldFont = "WorkSans-Bold";
  const { darkMode } = useContext(ThemeContext);
  console.log(entryId.id);

  return (
    <>
      <SafeAreaView className={`flex-1 justify-center items-center ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'}`}>
        <Stack.Screen
          options=
          {{
            headerBackVisible: true,
            headerStyle: { backgroundColor: darkMode ? "#1b1b1b" : "#fff" },
            headerTintColor: darkMode ? "#fff" : "#000",
            headerShadowVisible: false
          }}
        />
        <ScrollView>
          <Text>Single Entry</Text>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}
