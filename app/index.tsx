import "../global.css";

import { Sun } from "../lib/icons/Sun";
import { colorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { useState } from "react";
import { MoonStar } from "../lib/icons/MoonStar";

export default function Index() {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    
    setCurrentTheme(newTheme);
    colorScheme.set(newTheme);
  };
  return (
    <>
      {/* <StatusBar style={currentTheme === "dark" ? "light" : "dark"}/> */}
      <View className="flex flex-1 justify-center items-center">
        <Text className="text-red-800">
          Edit app/index.tsx to edit this screen.
        </Text>
        {currentTheme === "dark" ? <Sun color="#fff" onPress={toggleTheme} /> : <MoonStar color="#000" onPress={toggleTheme}/>}
      </View>
    </>
  );
}
