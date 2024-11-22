import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Auth from "../components/Auth";
import HomeScreen from "../components/HomeScreen";
import { RootStackParamList } from "@/types";

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
