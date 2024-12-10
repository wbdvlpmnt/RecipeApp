import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSession } from "../../context/ctx";
import { supabase } from "../../supabase/supabase"; // Adjust the path as needed
import { router } from "expo-router";

export default function Index() {
  const { signOut } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipes from Supabase
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("recipes").select("*");

      if (error) {
        console.error("Error fetching recipes:", error);
      } else {
        setRecipes(data);
      }

      setLoading(false);
    };

    fetchRecipes();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => router.push(`/recipe-details?recipeId=${item.id}`)}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Recipe List */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        style={styles.list}
      />

      {/* Bottom Navigation */}
      <View style={styles.navPanel}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            // The `_layout.tsx` will redirect to the sign-in screen
            signOut();
          }}
        >
          <Text style={styles.navButtonText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            router.replace("/post-recipe");
          }}
        >
          <Text style={styles.navButtonText}>New Recipe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    flex: 1,
    marginBottom: 60, // Leaves space for the navigation panel
  },
  listContainer: {
    padding: 10,
  },
  recipeCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  navPanel: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "#2196F3",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
