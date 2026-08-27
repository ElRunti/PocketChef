import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase.js";

function getFallbackProfile(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.user_metadata?.name || user.email?.split("@")[0] || "Chef",
    role: "user",
  };
}

export function useAuth() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async (user) => {
    if (!user || !supabase) {
      setProfile(null);
      return null;
    }

    const fallbackProfile = getFallbackProfile(user);
    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("id,name,role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !data) {
      setProfile(fallbackProfile);
      return fallbackProfile;
    }

    setProfile(data);
    return data;
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) {
        return;
      }

      setSession(data.session);
      await loadProfile(data.session?.user ?? null);
      if (active) {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setLoading(true);
        setTimeout(async () => {
          await loadProfile(nextSession?.user ?? null);
          setLoading(false);
        }, 0);
      },
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  async function signIn({ email, password }) {
    setError("");
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      throw signInError;
    }

    await loadProfile(data.user);
    return data;
  }

  async function signUp({ name, email, password }) {
    setError("");
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: window.location.origin,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      throw signUpError;
    }

    if (data.session) {
      await loadProfile(data.user);
    }

    return data;
  }

  async function signOut() {
    setError("");
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      throw signOutError;
    }

    setSession(null);
    setProfile(null);
  }

  return {
    error,
    isAdmin: profile?.role === "admin",
    isConfigured: isSupabaseConfigured,
    loading,
    profile,
    session,
    signIn,
    signOut,
    signUp,
    user: session?.user ?? null,
  };
}
