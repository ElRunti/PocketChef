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
    <div>
      <label htmlFor="image">Imagen de la receta:</label>

      <input
        type="file"
        id="image"
        accept="image/*"
        onChange={handleImageChange}
      />

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