import { ActivityIndicator, Text, useColorScheme, View } from "react-native";

const Splash = () => {
  const theme = useColorScheme();

  return (
    <View className="flex flex-1 justify-center items-center m-2">
      <Text className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}>Loading...</Text>
      <View>
        <ActivityIndicator size="large" />
      </View>
    </View>
  );
};

export default Splash;
