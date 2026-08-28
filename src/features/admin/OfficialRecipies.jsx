import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

function OfficialRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOfficialRecipes = async () => {
            const { data, error } = await supabase
                .from("recipes")
                .select("*")
                .eq("source", "official")
                .order("created_at", {
                    ascending: false,
                });

            if (error) {
                console.error(
                    "Error al cargar recetas oficiales:",
                    error
                );
                setLoading(false);
                return;
            }

            setRecipes(data || []);
            setLoading(false);
        };

        loadOfficialRecipes();
    }, []);

    if (loading) {
        return <p>Cargando recetas oficiales...</p>;
    }

    return (
        <section>
            <h2>Recetas oficiales</h2>

            <button type="button">
                Nueva receta oficial
            </button>

            {recipes.length === 0 ? (
                <p>
                    Todavía no hay recetas oficiales.
                </p>
            ) : (
                <div>
                    {recipes.map((recipe) => (
                        <article key={recipe.id}>
                            <h3>{recipe.title}</h3>

                            <p>
                                {recipe.description}
                            </p>

                            <button type="button">
                                Editar
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default OfficialRecipes;