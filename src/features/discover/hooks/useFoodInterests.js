import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase.js";

export function useFoodInterests(user) {
  const [interestCategoryIds, setInterestCategoryIds] = useState([]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !user) {
      setInterestCategoryIds([]);
      return undefined;
    }

    let active = true;

    supabase
      .from("profile_interests")
      .select("category_id")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (!active || error) {
          return;
        }

        setInterestCategoryIds(data.map((interest) => interest.category_id));
      });

    return () => {
      active = false;
    };
  }, [user]);

  async function toggleInterest(categoryId) {
    if (!isSupabaseConfigured || !supabase || !user) {
      throw new Error("Inicia sesion para guardar tus intereses.");
    }

    const removing = interestCategoryIds.includes(categoryId);
    const request = removing
      ? supabase
          .from("profile_interests")
          .delete()
          .eq("user_id", user.id)
          .eq("category_id", categoryId)
      : supabase.from("profile_interests").upsert({
          user_id: user.id,
          category_id: categoryId,
        });
    const { error } = await request;

    if (error) {
      throw error;
    }

    setInterestCategoryIds((currentInterests) =>
      removing
        ? currentInterests.filter((id) => id !== categoryId)
        : [...currentInterests, categoryId],
    );
  }

  return { interestCategoryIds, toggleInterest };
}
