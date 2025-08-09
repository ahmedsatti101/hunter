import "~/global.css";

import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, Pressable } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Loading from "~/components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MoonStar, Sun } from "lucide-react-native";

export {
  ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hasMounted = useRef(false);
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("theme");
        if (saved === "light" || saved === "dark") {
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
    const next = themeMode === "light" ? "dark" : "light";
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
    <ThemeProvider value={themeMode === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style={themeMode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerTitle: "Hello",
          headerRight: () => {
            return (
              <Pressable onPress={toggleTheme}>
                {themeMode === "dark" ? <Sun color="#fff"/> : <MoonStar color="#000"/>}
              </Pressable>
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
