import "~/global.css";

import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Loading from "~/components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useColorScheme } from "~/lib/useColorScheme";
import ThemeToggle from "~/components/ThemeToggle";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hasMounted = useRef(false);
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const { isDarkColorScheme } = useColorScheme();
  const [appReady, setAppReady] = useState(false);
  const [themeMode, setThemeMode] = useState<string | null>(null);

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
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    })();
  }, []);

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

  DarkTheme.colors.background = "rgb(27 27 27)";

  return (
    <ThemeProvider
      value={
        themeMode === null
          ? isDarkColorScheme
            ? DarkTheme
            : DefaultTheme
          : themeMode === "dark"
            ? DarkTheme
            : DefaultTheme
      }
    >
      <StatusBar
        style={
          themeMode === null
            ? isDarkColorScheme
              ? "light"
              : "dark"
            : themeMode === "dark"
              ? "light"
              : "dark"
        }
      />
      <Stack
        screenOptions={{
          headerTitle: "Hello",
          headerStyle: { backgroundColor: themeMode === null ? isDarkColorScheme ? "#1b1b1b" : "#fff" : themeMode === "dark" ? "#1b1b1b" : "#fff" },
          headerShadowVisible: false,
          headerRight: () => {
            return (
              <ThemeToggle themeMode={themeMode} toggleTheme={toggleTheme} isDarkColorScheme={isDarkColorScheme}/>
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
