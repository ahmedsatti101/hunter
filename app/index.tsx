import { Text, View } from "react-native";
import SignInMethods from "~/app/sign-in/SignInMethods";

export default function Index() {
  //To be changed when AWS SDK is used with Cognito
  const userSession = null;
  if (userSession === null) {
    return <SignInMethods />
  } else {
    return (
      <>
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-800">
            Edit app/index.tsx to edit this screen.
          </Text>
        </View>
      </>
    );
  }
}
