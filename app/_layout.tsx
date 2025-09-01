import "~/global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Loading from "~/screens/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ThemeToggle from "~/components/ThemeToggle";
import { useFonts } from "expo-font";
import ThemeProvider from "~/context/ThemeContext";
import { useContext } from "react";
import { ThemeContext } from "~/context/ThemeContext";
export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hasMounted = useRef(false);
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [themeMode, setThemeMode] = useState<string | null>(null);
  const [fontLoaded, error] = useFonts({
    'WorkSans-Medium': require("../assets/fonts/WorkSans-Medium.ttf"),
    'WorkSans-Bold': require("../assets/fonts/WorkSans-Bold.ttf"),
  });
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("theme");
        if (saved !== null) {
          setThemeMode(saved);
        }
      } catch (error) {
        console.warn(error);
      } finally {
        if (fontLoaded || error) {
          setAppReady(true);
          SplashScreen.hideAsync();
        }
      }
    })();
  }, [fontLoaded, error]);

  const toggleTheme = useCallback(async () => {
    let next = themeMode === "light" ? "dark" : "light";
    setThemeMode(next);
    try {
      await AsyncStorage.setItem("theme", next);
    } catch (err) {
      console.warn("Failed to save theme:", err);
    }
  }, [themeMode]);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      document.documentElement.classList.add("bg-background");
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  if (!appReady) {
    return <Loading />;
  }

  return (
    <ThemeProvider>
      <StatusBar
        style="auto"
      />
      <Stack
        screenOptions={{
          headerTitle: "Hello",
          headerStyle: { backgroundColor: darkMode ? "#1b1b1b" : "#fff" },
          headerShadowVisible: false,
          headerRight: () => {
            return (
              <ThemeToggle />
            );
          },
        }}
      />
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? useEffect
    : useLayoutEffect;
