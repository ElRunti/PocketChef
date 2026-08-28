import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import CommunityRecipeCard from "../admin/CommunityRecipeCard.jsx";

function CommunityRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadRecipes = async () => {
        setLoading(true);
        setMessage("");

        const { data, error } = await supabase
            .from("recipes")
            .select(`
                id,
                title,
                description,
                category_id,
                time_minutes,
                difficulty,
                image_url,
                rating,
                status,
                rejection_reason,
                created_at,
                user_id,
                recipe_ingredients (
                    ingredient_id
                ),
                recipe_steps (
                    id,
                    step_number,
                    text,
                    has_timer,
                    timer_minutes
                )
            `)
            .eq("source", "community")
            .eq("status", "pending")
            .order("created_at", {
                ascending: false,
            });

        if (error) {
            console.error("Error al cargar recetas:", error);
            setMessage("No se pudieron cargar las recetas.");
            setLoading(false);
            return;
        }

        setRecipes(data || []);
        setLoading(false);
    };

    useEffect(() => {
        loadRecipes();
    }, []);

    if (loading) {
        return <p>Cargando recetas...</p>;
    }

    return (
        <section>
            <h2>Recetas pendientes</h2>

            {message && <p>{message}</p>}

            {recipes.length === 0 ? (
                <p>No hay recetas pendientes de revisión.</p>
            ) : (
                <div className="community-recipes-grid">
                    {recipes.map((recipe) => (
                        <CommunityRecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onUpdated={loadRecipes}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default CommunityRecipes;