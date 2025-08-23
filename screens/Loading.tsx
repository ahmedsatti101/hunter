import { ActivityIndicator, Text, useColorScheme, View } from "react-native";

export default function Loading () {
  const theme = useColorScheme();

  return (
    <View className="flex flex-1 justify-center items-center">
      <Text className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}>Loading...</Text>
      <View>
        <ActivityIndicator size="large" testID="loading-indicator"/>
      </View>
    </View>
  );
};
