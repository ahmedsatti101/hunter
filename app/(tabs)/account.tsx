import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Stack } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuth } from "~/context/AuthProvider";
import { ThemeContext } from "~/context/ThemeContext";
import Loading from "~/screens/Loading";

export default function Account() {
  const { darkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState<boolean>();
  const [username, setUsername] = useState<string>();
  const auth = useAuth();

  const handleSignOut = async () => {
    setLoading(true);
    await auth.signout().catch(() => {
      setLoading(false);
    })
  };

  const handleUsernameUpdate = async () => {
    const token = await AsyncStorage.getItem("token");
    if (username) {
      axios.post("http://127.0.0.1:3000/updateUsername", {
        token,
        attributes: [
          {
            Name: "preferred_username",
            Value: username
          }
        ]
      }).then((res) => {
        if (res.status === 200) {
          Alert.alert("Success", res.data.message);
          AsyncStorage.setItem("username", username);
          return;
        }
      }).catch((err) => {
        Alert.alert("Error", err.response.data.message);
      });
    };
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

        <View className="m-2">
          <Label
            className={`${darkMode ? 'text-white' : 'text-black'} text-xl`}
            style={{ fontFamily: "WorkSans-Medium", fontWeight: "bold" }}
            nativeID="username"
            htmlFor="username">
            Username
          </Label>

          <Input
            onChangeText={(value) => setUsername(value)}
            returnKeyType="send"
            autoCapitalize="none"
            textContentType="username"
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
