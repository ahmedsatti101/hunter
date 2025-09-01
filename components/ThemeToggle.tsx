import { Moon } from "~/lib/icons/Moon";
import { Sun } from "~/lib/icons/Sun";
import { Pressable } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "~/context/ThemeContext";

type Props = {
  themeMode: string | null;
  toggleTheme: () => void;
  isDarkColorScheme: boolean;
};

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const changeTheme = () => {
    toggleDarkMode();
  }

  return (
    <Pressable onPress={changeTheme} testID="toggle-theme-btn">
      {darkMode ? <Sun color="#fff" testID="sun-icon" /> : <Moon color="#000" testID="moon-icon" />}
    </Pressable>
  );
}
