import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { object, string, ObjectSchema } from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "~/components/ui/label";
import { useRef } from "react";

interface UserSignIn {
  email: string;
  password: string;
}

const createYupSchema = <T extends object>(schema: ObjectSchema<T>): ObjectSchema<T> => schema;

const userFormSchema = createYupSchema<UserSignIn>(
  object().shape({
    email: string()
      .required("Email is required")
      .email("Invalid email format"),
    password: string()
      .required("Password is required")
      .min(12, "Password too short")
      .matches(/\d/g, { message: "Missing at least one digit", excludeEmptyString: true })
      .matches(/[a-z]/g, { message: "Missing lowercase character", excludeEmptyString: true })
      .matches(/[A-Z]/g, { message: "Missing uppercase character", excludeEmptyString: true })
      .matches(/[!@#\$%&\*\(\)\-_+\=\[\]\{\};:'"\\|,<>\.\/\?`~]/g, { message: "Missing special character", excludeEmptyString: true })
      .max(256, "Password maximum length exceeded")
  })
);

export default function SignInWithEmail() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(userFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const passwordInputRef = useRef(null);

  const mediumFont = "WorkSans-Medium";
  const boldFont = "WorkSans-Bold";

  const PASSREQS = [
    "Minimum of 12 characters",
    "Must contain at least one digit",
    "Must contain a lowercase character",
    "Must contain a uppercase character",
    "Must contain a special character"
  ];

  const submitToCognito = (formData: UserSignIn) => {
    //TODO
  };

  return (
    <View className="flex-1 justify-center items-center m-2">
      <Stack.Screen options={{ headerTitle: "", headerRight: undefined }} />

      <Text className="text-4xl" style={{ fontFamily: boldFont }} testID="signin-screen-header">Sign in</Text>

      <View className="m-2">
        <Label style={{ fontFamily: mediumFont, fontWeight: "bold" }} className="text-xl" htmlFor="email" nativeID='email'>Email</Label>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              placeholder="john.doe@example.com"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current.focus()}
              autoCapitalize="none"
              autoFocus={true}
              textContentType="emailAddress"
              autoComplete="off"
              style={{ fontFamily: mediumFont }}
              testID="email-input-field"
              className="p-2 border-[#a7a7a7] rounded-lg text-xl h-[50px] w-[300px]"
            />
          )}
          name="email"
        />
        {errors.email && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.email.message}</Text>}
      </View>

      <View className="m-2">
        <Label style={{ fontFamily: mediumFont, fontWeight: "bold" }} className="text-xl" htmlFor="password" nativeID='password'>Password</Label>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              textContentType="password"
              secureTextEntry
              value={value}
              autoCapitalize="none"
              onChangeText={onChange}
              ref={passwordInputRef}
              testID="password-input-field"
              className="p-2 border-[#a7a7a7] rounded-lg text-xl h-[50px] w-[300px]"
            />
          )}
          name="password"
        />
        {errors.password && <Text className="text-red-700" style={{ fontFamily: mediumFont }}>{errors.password.message}</Text>}

        <Text style={{ fontFamily: boldFont }} className="text-md mt-2 text-[#7b7b7b]">Password requirements:</Text>
        {PASSREQS.map((req, idx) => {
          return (
            <Text key={idx} testID="password-requirements" style={{ fontFamily: boldFont }} className="text-[15px] text-[#7b7b7b]">{req}</Text>
          )
        })}
        <Button className="justify-start mt-3">
          <Text className="text-base underline text-[#4160de] text-xl" style={{ fontFamily: mediumFont }}>Forgot password?</Text>
        </Button>
      </View>
      <Button testID="signin-btn" className="bg-[#000] ml-60 mt-3" onPress={handleSubmit(submitToCognito)}>
        <Text className="text-white border rounded-md p-4 text-lg" style={{ fontFamily: mediumFont }}>Sign in</Text>
      </Button>
    </View>
  );
};
