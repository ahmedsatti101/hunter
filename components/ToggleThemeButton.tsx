import { useState } from "react";
import { View } from "react-native";
import { MoonStar } from "~/lib/icons/MoonStar";
import { Sun } from "~/lib/icons/Sun";
import { colorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ToggleThemeButton() {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  const toggleTheme = async () => {
    try {
      const newTheme = currentTheme === "light" ? "dark" : "light";

      setCurrentTheme(newTheme);
      colorScheme.set(newTheme);

      await AsyncStorage.setItem("theme", newTheme);
    } catch (error) {
      throw error;
    }
  };
  return (
    <View>
      {currentTheme === "dark" ? (
        <Sun color="#fff" onPress={toggleTheme} />
      ) : (
        <MoonStar color="#000" onPress={toggleTheme} />
      )}
    </View>
  );
}
