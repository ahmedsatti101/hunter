import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Stack } from "expo-router";
import { useContext, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuth } from "~/context/AuthProvider";
import { ThemeContext } from "~/context/ThemeContext";
import Loading from "~/screens/Loading";

export default function Account() {
  const { darkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState<boolean>();
  const { signout } = useAuth();

  const handleSignOut = async () => {
    setLoading(true);
    await signout().catch(() => {
      setLoading(false);
    })
  };

  if (loading) return <Loading />;

  return (
    <>
      <View className={`${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'} flex-1 justify-center items-center`}>
        <Stack.Screen
          options=
          {{
            headerBackVisible: false,
            headerLeft: undefined,
            title: "Account",
            headerTitleStyle: { fontFamily: "WorkSans-Bold" },
            headerStyle: { backgroundColor: darkMode ? "#1b1b1b" : "#fff" },
            headerTintColor: darkMode ? "#fff" : "#000",
            headerShadowVisible: false
          }}
        />

        <Button className="bg-[#f40808] m-1 w-[300px] rounded-lg" onPress={handleSignOut}>
          <Text style={{ fontFamily: "WorkSans-Medium" }} className="text-xl p-4">Sign out</Text>
        </Button>
      </View>
    </>
  )
}
