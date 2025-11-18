import { View } from "react-native";
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { AntDesign, FontAwesome5, Feather } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { ThemeContext } from "~/context/ThemeContext";
import { useAuth } from "~/context/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignInMethods() {
  const router = useRouter();
  const buttonStyle = "p-3 m-3 bg-[#fbfbfb] rounded-lg flex-row border border-[#a7a7a7]";
  const { darkMode } = useContext(ThemeContext);
  const { validSession } = useAuth();

  useEffect(() => {
    AsyncStorage.getItem("token").then((res) => {
      if (res) {
        validSession().then((valid) => {
          if (valid) router.replace("/(tabs)");
        });
      };
    });
  }, []);

  return (
    <View className="flex-1 justify-center items-center" style={{ backgroundColor: `${darkMode ? '#1b1b1b' : '#fff'}` }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text className={`text-[23px] ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontFamily: "WorkSans-Bold" }}>Choose your sign in method</Text>

      <View className="m-1">
        <Button variant="outline" className={buttonStyle} onPress={() => router.navigate("/sign-in")}>
          <Feather name="mail" size={24} color="black" className="m-2" />
          <Text className="text-lg" style={{ fontFamily: 'WorkSans-Medium' }}>Sign in with email</Text>
        </Button>
        <Button variant="outline" className={buttonStyle}>
          <AntDesign name="google" size={24} color="black" className="m-2" />
          <Text className="text-lg" style={{ fontFamily: 'WorkSans-Medium' }}>Sign in with Google</Text>
        </Button>
        <Button variant="outline" className={buttonStyle}>
          <FontAwesome5 name="facebook-f" size={24} color="black" className="m-2" />
          <Text className="text-lg" style={{ fontFamily: 'WorkSans-Medium' }}>Sign in with Facebook</Text>
        </Button>
      </View>
      <Button variant="link" onPress={() => router.navigate("/sign-up")}>
        <Text className={`text-lg ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'WorkSans-Medium' }}>Don't have an account? Click here</Text>
      </Button>
    </View>
  )
}
