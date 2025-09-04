import { Stack } from "expo-router";
import { useContext, useRef } from "react";
import { Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ThemeContext } from "~/context/ThemeContext";

export default function SignUp() {
  const { darkMode } = useContext(ThemeContext);
  const mediumFont = "WorkSans-Medium";
  const boldFont = "WorkSans-Bold";
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  return (
    <View className={`flex-1 justify-center items-center ${darkMode === true ? 'bg-[#1b1b1b]' : 'bg-white'}`}>

      <Stack.Screen options={{ headerTitle: "", headerRight: undefined, headerStyle: { backgroundColor: `${darkMode === true ? '#1b1b1b' : '#fff'}` }, headerTintColor: darkMode ? '#fff' : '#000' }} />

      <View className="m-2">
        <Label
          style={{ fontFamily: mediumFont, fontWeight: "bold" }}
          className={`text-xl ${darkMode === true ? 'text-white' : 'text-black'}`}
          htmlFor="email"
          nativeID="email"
        >
          Email
        </Label>

        <Input
          testID="email-input-field"
          className={`p-2 border-[#a7a7a7] rounded-lg text-xl h-[50px] w-[300px] ${darkMode === true ? 'bg-[#1b1b1b]' : 'bg-white'}`}
          placeholder="john.doe@example.com"
          keyboardType="email-address"
          returnKeyType="next"
          autoCapitalize="none"
          autoFocus={true}
          textContentType="emailAddress"
          autoComplete="off"
          style={{ fontFamily: mediumFont }}
          onSubmitEditing={() => passwordInputRef.current.focus()}
        />

        <Label
          style={{ fontFamily: mediumFont, fontWeight: "bold" }}
          className={`text-xl ${darkMode === true ? 'text-white' : 'text-black'}`}
          htmlFor="password"
          nativeID="password"
        >
          Create Password
        </Label>

        <Input
          testID="password-input-field"
          className={`p-2 border-[#a7a7a7] rounded-lg text-xl h-[50px] w-[300px] ${darkMode === true ? 'bg-[#1b1b1b]' : 'bg-white'}`}
          textContentType="password"
          secureTextEntry
          ref={passwordInputRef}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordInputRef.current.focus()}
        />

        <Label
          style={{ fontFamily: mediumFont, fontWeight: "bold" }}
          className={`text-xl ${darkMode === true ? 'text-white' : 'text-black'}`}
          htmlFor="confirmPassword"
          nativeID="confirmPassword"
        >
          Confirm Password
        </Label>

        <Input
          testID="confirm-password-input-field"
          className={`p-2 border-[#a7a7a7] rounded-lg text-xl h-[50px] w-[300px] ${darkMode === true ? 'bg-[#1b1b1b]' : 'bg-white'}`}
          textContentType="password"
          secureTextEntry
          ref={confirmPasswordInputRef}
          autoCapitalize="none"
        />
      </View>

      <Button className={`${darkMode === true ? 'bg-white' : 'bg-[#000]'} ml-60 mt-3`}>
        <Text className={`${darkMode === true ? 'text-black' : 'text-white'} border rounded-md p-4 text-lg`} style={{ fontFamily: boldFont }}>Create account</Text>
      </Button>
    </View>
  )
};
