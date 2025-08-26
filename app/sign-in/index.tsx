import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function SignInWithEmail() {
  return (
    <View className="flex-1 justify-center align-center">
      <Stack.Screen options={{ headerShown: false }} />
      <Text>Email</Text>
      <Input keyboardType="email-address" textContentType="emailAddress" autoComplete="email" placeholder="john.doe@example.com" />
      <Text>Password</Text>
      <Input keyboardType="visible-password" textContentType="password" />
      <Button className="bg-[#000]">
        <Text className="bg-[#fff]">Sign in</Text>
      </Button>
      <Button>
        <Text className="underline text-[#4160de]">Forgot password?</Text>
      </Button>
    </View>
  );
}
