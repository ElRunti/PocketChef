import { useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase.js";

function ImageUpload({ image, setImage }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        setError("");

        if (!isSupabaseConfigured || !supabase) {
            setError("Configura Supabase en el archivo .env para subir imagenes.");
            return;
        }

        setUploading(true);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setError("Debes iniciar sesión para subir una imagen.");
                return;
            }

            const fileExtension = file.name.split(".").pop();

            const filePath = `${user.id}/${crypto.randomUUID()}.${fileExtension}`;

            const { error: uploadError } = await supabase.storage
                .from("recipe-images")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from("recipe-images")
                .getPublicUrl(filePath);

            setImage(data.publicUrl);
        } catch (error) {
            console.error("Error al subir imagen:", error);
            setError("No se pudo subir la imagen.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <label htmlFor="image">
                Imagen de la receta
            </label>

            <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
            />

            {uploading && (
                <p>Subiendo imagen...</p>
            )}

            {error && (
                <p>{error}</p>
            )}

            {image && (
                <div>
                    <p>Vista previa:</p>

                    <img
                        src={image}
                        alt="Vista previa de la receta"
                        width="300"
                    />
                </div>
            )}
        </div>
    );
}

export default ImageUpload;
