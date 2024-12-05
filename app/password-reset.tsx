import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Input, Button, Text } from "@rneui/themed";
import { supabase } from "../supabase/supabase";

export default function ResetPasswordRequest() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordResetRequest = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "your-app://update-password", // Deep link for redirect
      });
      if (error) throw error;
      Alert.alert(
        "Success",
        "Password reset email sent. Please check your inbox."
      );
    } catch (error: any) {
      console.error("Password reset error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.header}>
        Reset Password
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
      <Button
        title={isLoading ? "Sending..." : "Send Reset Link"}
        onPress={handlePasswordResetRequest}
        loading={isLoading}
        buttonStyle={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  header: { textAlign: "center", marginBottom: 10 },
  input: { marginBottom: 15 },
  button: { backgroundColor: "#2D9CDB" },
});
