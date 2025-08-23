import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
  const router = useRouter()
  return (
    <>
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-800">
          Edit app/index.tsx to edit this screen.
        </Text>
        <Button title="Go" onPress={() => router.navigate("/sign-in")} />
      </View>
    </>
  );
}
