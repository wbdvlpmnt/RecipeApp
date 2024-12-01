// context/ctx.ts
import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";
import { supabase } from "../supabase/supabase"; // Ensure this points to your Supabase client
import { Alert } from "react-native";

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        Alert.alert("Error", error.message);
        throw error;
      }
      setSession(data.session?.access_token || null);
    } catch (error) {
      console.error("Sign-in failed", error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
