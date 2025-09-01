import { Moon } from "~/lib/icons/Moon";
import { Sun } from "~/lib/icons/Sun";
import { Platform, Pressable } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "~/context/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const changeTheme = () => {
    toggleDarkMode();
  }

  return (
    <Pressable onPress={changeTheme} className={`${Platform.OS === "web" ? "m-2" : ""}`} testID="toggle-theme-btn">
      {darkMode ? <Sun color="#fff" testID="sun-icon" /> : <Moon color="#000" testID="moon-icon" />}
    </Pressable>
  );
}
