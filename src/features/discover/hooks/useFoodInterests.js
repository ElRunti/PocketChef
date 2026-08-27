import { useEffect, useState } from "react";

const STORAGE_KEY = "pocket-chef-food-interests";

function loadInterests() {
  try {
    const interests = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(interests) ? interests : ["breakfast", "quick"];
  } catch {
    return ["breakfast", "quick"];
  }
}

export function useFoodInterests() {
  const [interestCategoryIds, setInterestCategoryIds] = useState(loadInterests);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(interestCategoryIds));
    } catch {
      // Preferences remain active for the current session.
    }
  }, [interestCategoryIds]);

  function toggleInterest(categoryId) {
    setInterestCategoryIds((currentInterests) =>
      currentInterests.includes(categoryId)
        ? currentInterests.filter((id) => id !== categoryId)
        : [...currentInterests, categoryId],
    );
  }

  return { interestCategoryIds, toggleInterest };
}
