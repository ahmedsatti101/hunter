import { Stack } from "expo-router";
import { useContext } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ThemeContext } from "~/context/ThemeContext";

export default function Loading() {
  const { darkMode } = useContext(ThemeContext);
  const mediumFont = "WorkSans-Medium";

  return (
    <View className={`flex-1 justify-center items-center ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'}`}>
      <Stack.Screen options={{ headerShown: false }} />
      <View>
        <ActivityIndicator size="large" testID="loading-indicator" color={`${darkMode ? '#fff' : '#000'}`} />
      </View>
      <Text style={{ fontFamily: mediumFont }} className={`${darkMode ? 'text-white' : 'text-black'} m-2`}>Loading...</Text>
    </View>
  );
};
