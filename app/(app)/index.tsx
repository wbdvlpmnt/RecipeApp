import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useSession } from "../../context/ctx";
import { supabase } from "../../supabase/supabase"; // Adjust the path based on your setup
import { router } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Index() {
  const { signOut } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data, error } = await supabase
          .from("recipes")
          .select("id, title, description");

        if (error) {
          throw error;
        }
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        Alert.alert("Error", "Failed to fetch recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity style={styles.recipeCard} onPress={() => router.push(`/recipes/${item.id}`)}>
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <Text style={styles.recipeDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecipeItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <View style={styles.navigationPanel}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.replace("/post-recipe")}>
          <Icon name="plus-circle" size={24} color="#fff" />
          <Text style={styles.navButtonText}>New Recipe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={signOut}>
          <Icon name="sign-out" size={24} color="#fff" />
          <Text style={styles.navButtonText}>Sign Out</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 15,
  },
  recipeCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  recipeDescription: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  navigationPanel: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  navButton: {
    alignItems: "center",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
  },
});
