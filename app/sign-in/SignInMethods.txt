import { Platform, View } from "react-native";
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { AntDesign, FontAwesome5, Feather } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { ThemeContext } from "~/context/ThemeContext";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleSignin, isSuccessResponse, statusCodes } from "@react-native-google-signin/google-signin"; //https://react-native-google-signin.github.io/docs/original

WebBrowser.maybeCompleteAuthSession();

export default function SignInMethods() {
  const router = useRouter();
  const buttonStyle = "p-3 m-3 bg-[#fbfbfb] rounded-lg flex-row border border-[#a7a7a7]";
  const { darkMode } = useContext(ThemeContext);
  const [req, res, prompt] = Google.useAuthRequest({
    webClientId: "",
    androidClientId: ""
  });
  const [user, setUser] = useState<any | null>(null);

  console.log(req, "<<< Google req");
  console.log(res, "<<< Google res");

  GoogleSignin.configure()

  const handleGoogleSignin = async () => {
    if (Platform.OS === "web") {
      await prompt();
    } else {
      await GoogleSignin.hasPlayServices();

      try {
        const response = await GoogleSignin.signIn();
        if (isSuccessResponse(response)) {
          console.log(response.data);
          setUser(response.data)
        }
      } catch (error: any) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
          console.log('User cancelled the login flow');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (e.g. sign in) is in progress already
          console.log('Sign in is in progress');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
          console.log('Play services not available');
        } else {
          // some other error happened
          console.error(error);
        }
      }
    }
  }

  return (
    <View className="flex-1 justify-center items-center" style={{ backgroundColor: `${darkMode === true ? '#1b1b1b' : '#fff'}` }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text className={`text-[23px] ${darkMode === true ? 'text-white' : 'text-black'}`} style={{ fontFamily: "WorkSans-Bold" }}>Choose your sign in method</Text>

      <View className="m-1">
        <Button variant="outline" className={buttonStyle} onPress={() => router.navigate("/sign-in")}>
          <Feather name="mail" size={24} color="black" className="m-2" />
          <Text className="text-lg" style={{ fontFamily: 'WorkSans-Medium' }}>Sign in with email</Text>
        </Button>
        <Button variant="outline" className={buttonStyle} onPress={handleGoogleSignin}>
          <AntDesign name="google" size={24} color="black" className="m-2" />
          <Text className="text-lg" style={{ fontFamily: 'WorkSans-Medium' }}>Sign in with Google</Text>
        </Button>

        <Button variant="outline" className={buttonStyle}>
          <FontAwesome5 name="facebook-f" size={24} color="black" className="m-2" />
          <Text className="text-lg" style={{ fontFamily: 'WorkSans-Medium' }}>Sign in with Facebook</Text>
        </Button>
      </View>
      <Button variant="link" onPress={() => router.navigate("/sign-up")}>
        <Text className={`text-lg ${darkMode === true ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'WorkSans-Medium' }}>Don't have an account? Click here</Text>
      </Button>
    </View>
  )
}
