import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { supabase } from "../supabase/supabase"; // Adjust the import path based on your setup
import { router } from "expo-router";

export default function RecipeForm() {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);
  const [steps, setSteps] = useState([""]);

  const handleBackNavigation = () => router.push("/");

  const handleAddIngredient = () =>
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  const handleRemoveIngredient = (index) =>
    setIngredients(ingredients.filter((_, i) => i !== index));

  const handleAddStep = () => setSteps([...steps, ""]);
  const handleRemoveStep = (index) =>
    setSteps(steps.filter((_, i) => i !== index));

  const validateForm = () => {
    if (recipeTitle.trim().length < 3) {
      Alert.alert(
        "Validation Error",
        "Recipe title must be at least 3 characters."
      );
      return false;
    }
    if (description.trim().length < 10) {
      Alert.alert(
        "Validation Error",
        "Description must be at least 10 characters."
      );
      return false;
    }
    for (let i = 0; i < ingredients.length; i++) {
      const { name, quantity, unit } = ingredients[i];
      if (!name.trim()) {
        Alert.alert(
          "Validation Error",
          `Ingredient ${i + 1} name is required.`
        );
        return false;
      }
      if (!quantity.trim() || isNaN(Number(quantity))) {
        Alert.alert(
          "Validation Error",
          `Ingredient ${i + 1} quantity must be a number.`
        );
        return false;
      }
      if (!unit.trim()) {
        Alert.alert(
          "Validation Error",
          `Ingredient ${i + 1} unit is required.`
        );
        return false;
      }
    }
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].trim().length < 5) {
        Alert.alert(
          "Validation Error",
          `Step ${i + 1} must be at least 5 characters.`
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const payload = {
        title: recipeTitle,
        description,
        ingredients,
        steps,
        user_id: (await supabase.auth.getUser()).data.user?.id, // Get the authenticated user ID
      };

      try {
        const { data, error } = await supabase
          .from("recipes")
          .insert([payload]);

        if (error) {
          console.error("Error inserting recipe:", error);
          Alert.alert("Error", "Failed to save the recipe.");
        } else {
          Alert.alert("Success", "Recipe submitted successfully!");
          router.push("/");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create a Recipe</Text>

      <TextInput
        style={styles.input}
        placeholder="Recipe Title"
        value={recipeTitle}
        onChangeText={setRecipeTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.sectionHeader}>Ingredients</Text>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientContainer}>
          <TextInput
            style={[styles.input, { flex: 3 }]}
            placeholder="Ingredient"
            value={ingredient.name}
            onChangeText={(value) =>
              setIngredients(
                ingredients.map((ing, i) =>
                  i === index ? { ...ing, name: value } : ing
                )
              )
            }
          />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 5 }]}
            placeholder="Qty"
            keyboardType="numeric"
            value={ingredient.quantity}
            onChangeText={(value) =>
              setIngredients(
                ingredients.map((ing, i) =>
                  i === index ? { ...ing, quantity: value } : ing
                )
              )
            }
          />
          <TextInput
            style={[styles.input, { flex: 2, marginLeft: 5 }]}
            placeholder="Unit"
            value={ingredient.unit}
            onChangeText={(value) =>
              setIngredients(
                ingredients.map((ing, i) =>
                  i === index ? { ...ing, unit: value } : ing
                )
              )
            }
          />
          <TouchableOpacity
            onPress={() => handleRemoveIngredient(index)}
            style={styles.deleteButtonInline}
          >
            <Icon name="trash" size={16} color="#fff" />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
        <Icon name="plus" size={18} color="#fff" />
        <Text style={styles.addButtonText}>Add Ingredient</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionHeader, styles.stepsHeader]}>Steps</Text>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <TextInput
            style={[styles.input, styles.stepTextArea]}
            placeholder={`Step ${index + 1}`}
            value={step}
            onChangeText={(value) =>
              setSteps(steps.map((st, i) => (i === index ? value : st)))
            }
            multiline
          />
          <TouchableOpacity
            onPress={() => handleRemoveStep(index)}
            style={styles.deleteButtonFull}
          >
            <Icon name="trash" size={16} color="#fff" />
            <Text style={styles.deleteText}>Delete Step</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddStep}>
        <Icon name="plus" size={18} color="#fff" />
        <Text style={styles.addButtonText}>Add Step</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Icon name="paper-plane" size={18} color="#fff" />
        <Text style={styles.submitButtonText}>Submit Recipe</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackNavigation}
      >
        <Icon name="ban" size={18} color="#fff" />
        <Text style={styles.addButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 60,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  stepTextArea: {
    height: 100,
    flex: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  stepsHeader: {
    paddingTop: 15,
  },
  ingredientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  stepContainer: {
    marginBottom: 15,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 5,
  },
  deleteButtonInline: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  deleteButtonFull: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    marginTop: 5,
  },
  deleteText: {
    color: "#fff",
    marginLeft: 5,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f37521",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
});
