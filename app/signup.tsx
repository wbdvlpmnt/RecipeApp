// pages/signup.tsx
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Text } from "@rneui/themed";
import { router } from "expo-router";
import { supabase } from "../supabase/supabase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert("Success! Check your email for a verification link.");
      router.replace("/sign-in");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.header}>
        Create an Account
      </Text>
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
        title={isLoading ? "Creating Account..." : "Sign Up"}
        onPress={handleSignUp}
        loading={isLoading}
        buttonStyle={styles.button}
      />
      <Text style={styles.signInText}>
        Already have an account?{" "}
        <Text onPress={() => router.replace("/sign-in")} style={styles.link}>
          Sign in here
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
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#27AE60",
  },
  signInText: {
    marginTop: 20,
    textAlign: "center",
  },
  link: {
    color: "#27AE60",
    fontWeight: "bold",
  },
});
