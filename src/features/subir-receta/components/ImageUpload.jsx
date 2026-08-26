function ImageUpload({ image, setImage }) {
    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const imageUrl = URL.createObjectURL(file);

        setImage(imageUrl);
    };

    return (
        <div className="image-upload">
            <label htmlFor="image" className="image-upload-button">
                Seleccionar imagen
            </label>

            <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
            />

            {!image && (
                <p className="image-upload-hint">
                    Selecciona una imagen de tu dispositivo.
                </p>
            )}

            {image && (
                <div className="image-preview">
                    <p>Vista previa</p>

                    <img
                        src={image}
                        alt="Vista previa de la receta"
                    />
                </div>
            )}
        </div>
    );
}

export default ImageUpload;