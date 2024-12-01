// pages/signin.tsx
import { router } from "expo-router";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Text } from "@rneui/themed";
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
    <View style={styles.container}>
      <Text h3 style={styles.header}>
        Welcome Back
      </Text>
      <Text style={styles.subHeader}>Sign in to your account</Text>
      <Input
        placeholder="Email"
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={styles.input}
      />
      <Input
        placeholder="Password"
        leftIcon={{ type: "font-awesome", name: "lock" }}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        containerStyle={styles.input}
      />
      <Button
        title={isLoading ? "Signing in..." : "Sign In"}
        onPress={handleSignIn}
        loading={isLoading}
        buttonStyle={styles.button}
      />
      <Text style={styles.signUpText}>
        Don’t have an account?{" "}
        <Text onPress={() => router.push("/signup")} style={styles.link}>
          Sign up here
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
  },
  subHeader: {
    textAlign: "center",
    marginBottom: 20,
    color: "gray",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2D9CDB",
  },
  signUpText: {
    marginTop: 20,
    textAlign: "center",
  },
  link: {
    color: "#2D9CDB",
    fontWeight: "bold",
  },
});
