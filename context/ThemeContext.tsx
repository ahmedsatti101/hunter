import { createContext, ReactNode, useState } from "react"
import { useColorScheme } from "~/lib/useColorScheme";

export const ThemeContext = createContext({});

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { isDarkColorScheme } = useColorScheme();
  const [darkMode, setDarkMode] = useState(isDarkColorScheme);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
