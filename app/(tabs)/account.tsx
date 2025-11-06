import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Stack, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ThemeContext } from "~/context/ThemeContext";
import Loading from "~/screens/Loading";

export default function Account() {
  const { darkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState<boolean>();
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    if (token) {
      axios.post("/signout", {
        token
      }).then(async (res) => {
        if (res.status === 200) {
          await AsyncStorage.multiRemove(["token", "email"])
          setLoading(false);
          router.dismissAll();
        }
      }).catch((err) => {
        console.error(err);
      })
    } else {
      const oauthToken = await AsyncStorage.getItem("oauth_refresh_token");
      const body = new URLSearchParams();
      const clientId = "";

      body.append('client_id', clientId);

      if (oauthToken) {
        body.append("token", oauthToken);
        axios.post(`https://hunter.auth.eu-west-2.amazoncognito.com/oauth2/revoke`, body.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        }
        ).then((res) => {
          if (res.status === 200) {
            AsyncStorage.multiRemove(["email", "oauth_refresh_token"]);
            setLoading(false);
            router.dismissAll();
          }
        }).catch(err => console.log(err))
      }
    }
  };
  const handleUsernameUpdate = () => { };

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
