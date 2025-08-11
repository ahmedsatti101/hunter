import { useCallback, useState } from "react";
import { Pressable } from "react-native";
import { Sun } from "~/lib/icons/Sun";
import { useColorScheme } from "~/lib/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Moon } from "~/lib/icons/Moon";

export default function ToggleThemeButton() {
  const [themeMode, setThemeMode] = useState<string | null>(null);
  const { isDarkColorScheme } = useColorScheme();

  const toggleTheme = useCallback(async () => {
    let next: "light" | "dark";
    setThemeMode((prev) => {
      next = prev === "light" ? "dark" : "light";
      return next;
    });
    try {
      await AsyncStorage.setItem("theme", next!);
    } catch (err) {
      console.warn("Failed to save theme:", err);
    }
  }, []);
  return (
    <Pressable onPress={toggleTheme}>
      {themeMode === null ? (
        isDarkColorScheme ? (
          <Sun color="#fff" />
        ) : (
          <Moon color="#000" />
        )
      ) : themeMode === "dark" ? (
        <Sun color="#fff" />
      ) : (
        <Moon color="#000" />
      )}
    </Pressable>
  );
}
