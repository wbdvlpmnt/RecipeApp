import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { supabase } from "@/lib/supabase";
import Navigation from "@/navigation/Navigation";
import { Session } from "@supabase/supabase-js";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <Navigation />;
}
