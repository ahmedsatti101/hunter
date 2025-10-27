import { Stack } from "expo-router";
import { useContext } from "react";
import { Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ThemeContext } from "~/context/ThemeContext";

export default function Account() {
  const { darkMode } = useContext(ThemeContext);

  const handleSignOut = () => { };
  const handleUsernameUpdate = () => { };

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

        <View className="m-2">
          <Label
            className={`${darkMode ? 'text-white' : 'text-black'} text-xl`}
            style={{ fontFamily: "WorkSans-Medium", fontWeight: "bold" }}
            nativeID="username"
            htmlFor="username">
            Username
          </Label>

          <Input
            value={undefined}
            onChangeText={undefined}
            returnKeyType="send"
            autoCapitalize="none"
            textContentType="none"
            autoComplete="off"
            style={{ fontFamily: "WorkSans-Medium" }}
            testID="username-text-field"
            className={`p-2 border-[#a7a7a7] rounded-lg text-xl m-1 ${darkMode ? 'text-white' : 'text-black'} ${darkMode ? 'bg-[#1b1b1b]' : 'bg-white'} h-[50px] w-[300px]`}
          />
        </View>

        <Button className={`${darkMode ? 'bg-white' : 'bg-black'} m-1 w-[300px] rounded-lg`} onPress={handleUsernameUpdate}>
          <Text
            style={{ fontFamily: "WorkSans-Medium" }}
            className={`text-xl ${darkMode ? 'text-black' : 'text-white'} p-4`}>Update</Text>
        </Button>

        <Button className="bg-[#f40808] m-1 w-[300px] rounded-lg" onPress={handleSignOut}>
          <Text style={{ fontFamily: "WorkSans-Medium" }} className="text-xl p-4">Sign out</Text>
        </Button>
      </View>
    </>
  )
}
