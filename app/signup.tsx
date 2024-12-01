// pages/signup.tsx
import { useState } from "react";
import { TextInput, Button, View, Text, Alert } from "react-native";
import { supabase } from "../supabase/supabase";
import { router } from "expo-router";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      Alert.alert("Success", "Check your email for a verification link.");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Text onPress={() => router.replace("/sign-in")}>
        Already have an account? Sign in here.
      </Text>
    </View>
  );
}
