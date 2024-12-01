import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import { supabase } from "../supabase/supabase";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase.from("profiles").select().single();
      if (data) {
        setUsername(data.username);
        setBio(data.bio || "");
        setAvatar(data.avatar_url);
      } else if (error) {
        Alert.alert("Error", error.message);
      }
    }
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ username, bio, avatar_url: avatar })
      .eq("id", supabase.auth.user()?.id);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Profile updated!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput style={styles.input} value={bio} onChangeText={setBio} />
      {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
      <Button title="Update Profile" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  input: { borderWidth: 1, padding: 8, marginVertical: 8 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
});
