import { View } from "react-native";
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { AntDesign, FontAwesome5, Feather } from '@expo/vector-icons';
import { useColorScheme } from "~/lib/useColorScheme";

export default function Index() {
  const { colorScheme } = useColorScheme();
  const buttonStyle = "p-3 m-3 bg-[#fbfbfb] rounded-lg flex-row border border-[#a7a7a7]";

  return (
    <View className="flex-1 justify-center items-center">
      <Text className={`text-[23px] ${colorScheme === "dark" ? 'text-white' : 'text-black'}`} style={{ fontFamily: "WorkSans-Bold" }}>Choose your sign in method</Text>

      <View className="m-1">
        <Button variant="outline" className={buttonStyle}>
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
      <Button variant="link">
        <Text className={`text-lg ${colorScheme === "dark" ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'WorkSans-Medium' }}>Don't have an account? Click here</Text>
      </Button>
    </View>
  )
}
