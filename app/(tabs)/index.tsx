import Auth from "@/components/Auth";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { View, Text } from "react-native";

export default function HomeScreen() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View>
      <Auth />
      {session && session.user && <Text>{session.user.id}</Text>}
    </View>
  );
}
