import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Input, Button } from "@rneui/themed";
import { useSession } from "@/context/ctx";
import { jwtDecode } from "jwt-decode";
import { supabase } from "@/supabase/supabase";

export default function OnboardingScreen() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const { session } = useSession(); // Get session token from context

  // Decode the JWT to extract the user ID
  const getUserIdFromSession = (): string | null => {
    if (!session) return null;
    try {
      const decodedToken: any = jwtDecode(session);
      return decodedToken.sub || null; // 'sub' contains the user ID
    } catch (err) {
      console.error("Failed to decode session token", err);
      return null;
    }
  };

  const handleCompleteOnboarding = async () => {
    const userId = getUserIdFromSession();
    if (!userId) {
      Alert.alert("Error", "Unable to retrieve user ID.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        username,
        bio,
      });

      if (error) {
        console.error("Error updating profile:", error);
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success", "Your profile is set up!");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Let’s get your profile set up.</Text>

        <Input
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          leftIcon={{ type: "font-awesome", name: "user" }}
        />

        <Input
          label="Bio"
          placeholder="Tell us about yourself"
          value={bio}
          onChangeText={setBio}
          multiline
          leftIcon={{ type: "font-awesome", name: "info-circle" }}
        />

        <Button
          title="Complete Onboarding"
          loading={loading}
          onPress={handleCompleteOnboarding}
          buttonStyle={styles.button}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6200EE",
    marginTop: 20,
  },
});
