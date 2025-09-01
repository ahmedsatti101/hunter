import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useEffect, useState } from "react"
import { useColorScheme } from "~/lib/useColorScheme";

type Props = {
  darkMode: boolean | null
  toggleDarkMode: () => Promise<void>
};

export const ThemeContext = createContext<Props>({ darkMode: null, toggleDarkMode: async () => { } });

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { isDarkColorScheme } = useColorScheme();
  const [darkMode, setDarkMode] = useState(isDarkColorScheme);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        if (savedTheme !== null) setDarkMode(savedTheme === "dark");
      } catch (error) {
        console.warn(error);
      }
    };
    fetchTheme();
  }, []);

  const toggleDarkMode = async () => {
    const nextTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    try {
      await AsyncStorage.setItem("theme", nextTheme);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
