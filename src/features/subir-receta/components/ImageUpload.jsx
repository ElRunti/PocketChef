import { useState } from "react";
import { ImagePlus } from "lucide-react";
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

        const setLocalPreview = () => {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result);
            reader.onerror = () => setError("No se pudo leer la imagen.");
            reader.readAsDataURL(file);
        };

        if (file.size > 1_500_000) {
            setError("La imagen debe pesar menos de 1.5 MB.");
            return;
        }

        if (!isSupabaseConfigured || !supabase) {
            setLocalPreview();
            return;
        }

        setUploading(true);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setLocalPreview();
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
            setLocalPreview();
            setError("Vista previa local. Ejecuta la migracion para subirla.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="image-upload">
            <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
            />

            <label className="image-upload-button" htmlFor="image">
                <ImagePlus aria-hidden="true" size={19} />
                {image ? "Cambiar imagen" : "Elegir imagen"}
            </label>

            <p className="image-upload-hint">
                JPG, PNG o WEBP de hasta 1.5 MB
            </p>

            {uploading && (
                <p>Subiendo imagen...</p>
            )}

            {error && (
                <p>{error}</p>
            )}

            {image && (
                <div className="image-preview">
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
