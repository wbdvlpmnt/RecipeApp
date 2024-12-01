import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View, Button } from "react-native";
import { useSession } from "../context/ctx";

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn(email, password);
      router.replace("/"); // Redirect to home after successful sign-in
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          width: "80%",
          padding: 10,
          marginBottom: 20,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          width: "80%",
          padding: 10,
          marginBottom: 20,
        }}
      />
      <Button
        title={isLoading ? "Signing in..." : "Sign In"}
        onPress={handleSignIn}
        disabled={isLoading}
      />
      <Text
        onPress={() => {
          router.push("/signup"); // Example: redirect to sign-up page if needed
        }}
        style={{ marginTop: 10 }}
      >
        Don't have an account? Sign up here.
      </Text>
    </View>
  );
}
