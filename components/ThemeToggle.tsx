import { Moon } from "~/lib/icons/Moon";
import { Sun } from "~/lib/icons/Sun";
import { Pressable } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "~/context/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const changeTheme = () => {
    toggleDarkMode();
  }

  return (
    <Pressable onPress={changeTheme} className="m-3" testID="toggle-theme-btn">
      {darkMode ? <Sun color="#fff" testID="sun-icon" /> : <Moon color="#000" testID="moon-icon" />}
    </Pressable>
  );
}
