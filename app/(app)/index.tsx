import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Image,
} from "react-native";
import { useSession } from "../../context/ctx";
import { supabase } from "../../supabase/supabase";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Index() {
  const { signOut } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([
    "All",
    "Breakfast",
    "Lunch",
    "Snacks",
    "Healthy",
    "Dinner",
    "Dessert",
    "Cocktails",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchRecipes();
  }, [selectedCategory, searchQuery]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const query = supabase
        .from("recipes")
        .select("id, title, description, image_url, category");

      if (selectedCategory !== "All") {
        query.eq("category", selectedCategory);
      }

      if (searchQuery.trim()) {
        query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;
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

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => router.push(`/recipes/${item.id}`)}
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.recipeImage} />
      )}
      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.categoryButtonSelected,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.categoryTextSelected,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.categoriesContainer}
        showsHorizontalScrollIndicator={false}
      />

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
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.replace("/post-recipe")}
        >
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
  header: {
    padding: 10,
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  categoriesContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  categoryButton: {
    backgroundColor: "#ddd",
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 20,
    marginHorizontal: 5,
    height: 33,
  },
  categoryButtonSelected: {
    backgroundColor: "#4CAF50",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  categoryTextSelected: {
    color: "#fff",
  },
  listContainer: {
    padding: 15,
  },
  recipeCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  recipeImage: {
    width: "100%",
    height: 150,
  },
  recipeContent: {
    padding: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
