import { Text, View } from "react-native";
import SignInMethods from "~/app/sign-in/SignInMethods";
import { useContext } from "react";
import { ThemeContext } from "~/context/ThemeContext";

export default function Index() {
  //To be changed when AWS SDK is used with Cognito
  const userSession = null;
  const { darkMode } = useContext(ThemeContext);

  if (userSession === null) {
    return <SignInMethods />
  } else {
    return (
      <>
        <View className={`flex-1 justify-center items-center ${darkMode === true ? 'bg-[#1b1b1b]' : 'bg-white'}`}>
          <Text className="text-red-800">
            Edit app/index.tsx to edit this screen.
          </Text>
        </View>
      </>
    );
  }
}
