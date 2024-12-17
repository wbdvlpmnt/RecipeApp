import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../supabase/supabase";

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data, error } = await supabase
          .from("recipes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        console.log(data);
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (id) fetchRecipe();
  }, [id]);

  const handleBackPress = () => {
    router.replace("/");
  };

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{recipe.title}</Text>
      </View>

      {recipe.image && (
        <Image
          source={{ uri: recipe.image }}
          style={styles.recipeImage}
          resizeMode="cover"
        />
      )}

      <Text style={styles.description}>{recipe.description}</Text>

      <Text style={styles.subheading}>Ingredients:</Text>
      {recipe.ingredients && Array.isArray(recipe.ingredients) ? (
        recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>
            - {ingredient.quantity} {ingredient.unit} {ingredient.name}
          </Text>
        ))
      ) : (
        <Text style={styles.placeholder}>No ingredients provided.</Text>
      )}

      <Text style={styles.subheading}>Steps:</Text>
      {recipe.steps && Array.isArray(recipe.steps) ? (
        recipe.steps.map((step, index) => (
          <Text key={index} style={styles.step}>
            {index + 1}. {step}
          </Text>
        ))
      ) : (
        <Text style={styles.placeholder}>No steps provided.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 40,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flexShrink: 1,
    textAlign: "center",
    flex: 1,
  },
  recipeImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: "#555",
  },
  subheading: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 4,
    color: "#555",
  },
  step: {
    fontSize: 16,
    marginTop: 8,
    lineHeight: 24,
    color: "#555",
  },
  placeholder: {
    fontSize: 16,
    color: "#aaa",
  },
  error: {
    fontSize: 18,
    color: "red",
  },
});
