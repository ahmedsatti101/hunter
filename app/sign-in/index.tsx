import { View } from "react-native";
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Icon } from "~/components/ui/icon";
import { Mail } from "lucide-react-native";

export default function Index() {

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl">Choose your sign in method</Text>

      <View className="m-1">
        <Button variant="outline" className="m-3 bg-[#fbfbfb] rounded-lg flex-row border border-[#a7a7a7]">
          <Icon as={Mail} className="text-primary-foreground m-1" />
          <Text className="text-lg m-1">Sign in with email</Text>
        </Button>
        <Button variant="outline" className="m-3 bg-[#fbfbfb] rounded-lg flex-row border border-[#a7a7a7]">
          <Text className="text-lg m-1">Sign in with Google</Text>
        </Button>
        <Button variant="outline" className="m-3 bg-[#fbfbfb] rounded-lg flex-row border border-[#a7a7a7]">
          <Text className="text-lg m-1">Sign in with Facebook</Text>
        </Button>
      </View>
      <Text>Don't have an account? Click here</Text>
    </View>
  )
}
