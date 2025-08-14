import { Moon } from "~/lib/icons/Moon";
import { Sun } from "~/lib/icons/Sun";
import { Pressable } from "react-native";

type Props = {
  themeMode: string | null;
  toggleTheme: () => void;
  isDarkColorScheme: boolean;
};

export default function ThemeToggle({
  themeMode,
  toggleTheme,
  isDarkColorScheme,
}: Props) {
  return (
    <Pressable onPress={toggleTheme} testID="toggle-theme-btn">
      {themeMode === null ? (
        isDarkColorScheme ? (
          <Sun color="#fff" testID="sun-icon"/>
        ) : (
          <Moon color="#000" testID="moon-icon"/>
        )
      ) : themeMode === "dark" ? (
        <Sun color="#fff" testID="sun-icon"/>
      ) : (
        <Moon color="#000" testID="moon-icon"/>
      )}
    </Pressable>
  );
}
