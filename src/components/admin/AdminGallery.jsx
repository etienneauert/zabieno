import { useState, useMemo, useRef, useEffect } from "react";
import styles from "./AdminGallery.module.css";
import {
  getDeletedImages,
  deleteImage,
  isImageDeleted,
} from "../../utils/deletedImages";
import {
  getAddedImagesByCategory,
  addImage,
  removeAddedImage,
} from "../../utils/addedImages";

// Importiere alle Bilddaten
const paintingModules = import.meta.glob(
  "/src/assets/zabieno-material/gemälde/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" },
);

const photoModules = import.meta.glob(
  "/src/assets/zabieno-material/Fotografien/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" },
);

const exhibitionModules = import.meta.glob(
  "/src/assets/zabieno-material/Ausstellung*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, import: "default" },
);

const allPaintings = Object.entries(paintingModules)
  .map(([path, url]) => ({
    path,
    url,
    name: path.split("/").pop() ?? path,
    category: "gemaelde",
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "de"));

const allPhotos = Object.entries(photoModules)
  .map(([path, url]) => ({
    path,
    url,
    name: path.split("/").pop() ?? path,
    category: "fotografien",
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "de"));

const allExhibitions = Object.entries(exhibitionModules)
  .map(([path, url]) => ({
    path,
    url,
    name: path.split("/").pop() ?? path,
    category: "ausstellungen",
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "de"));

export default function AdminGallery({ category, lang = "de", onBack }) {
  const isEn = lang === "en";
  const [deletedPaths, setDeletedPaths] = useState(getDeletedImages());
  const [addedImages, setAddedImages] = useState(
    getAddedImagesByCategory(category),
  );
  const fileInputRef = useRef(null);

  // Aktualisiere addedImages wenn sich die Kategorie ändert
  useEffect(() => {
    setAddedImages(getAddedImagesByCategory(category));
  }, [category]);

  // Höre auf Custom Events für Bild-Updates
  useEffect(() => {
    const handleImagesUpdated = () => {
      setAddedImages(getAddedImagesByCategory(category));
    };

    window.addEventListener("imagesUpdated", handleImagesUpdated);
    return () => {
      window.removeEventListener("imagesUpdated", handleImagesUpdated);
    };
  }, [category]);

  const images = useMemo(() => {
    let staticImages;
    switch (category) {
      case "gemaelde":
        staticImages = allPaintings;
        break;
      case "fotografien":
        staticImages = allPhotos;
        break;
      case "ausstellungen":
        staticImages = allExhibitions;
        break;
      default:
        staticImages = [];
    }

    const filteredStaticImages = staticImages.filter(
      (img) => !isImageDeleted(img.path),
    );
    return [...filteredStaticImages, ...addedImages];
  }, [category, deletedPaths, addedImages]);

  const handleDelete = (e, imagePath, imageId = null) => {
    e.stopPropagation();
    if (
      window.confirm(
        isEn
          ? "Do you really want to delete this image? This action can be undone by clearing the browser cache."
          : "Möchten Sie dieses Bild wirklich löschen? Diese Aktion kann rückgängig gemacht werden, indem Sie den Browser-Cache löschen.",
      )
    ) {
      if (imageId) {
        // Löschen eines hinzugefügten Bildes
        removeAddedImage(imageId);
        setAddedImages(getAddedImagesByCategory(category));
      } else {
        // Löschen eines statischen Bildes
        deleteImage(imagePath);
        setDeletedPaths(getDeletedImages());
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target?.files?.[0];
    if (!file) {
      return;
    }

    // Prüfe ob es ein Bild ist
    if (!file.type.startsWith("image/")) {
      alert(
        isEn
          ? "Please select an image file."
          : "Bitte wählen Sie eine Bilddatei aus.",
      );
      return;
    }

    // Konvertiere die Datei zu einer Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        // Extrahiere den Dateinamen ohne Extension
        const imageName = file.name.replace(/\.[^/.]+$/, "");

        // Füge das Bild direkt hinzu
        addImage({
          url: dataUrl,
          name: imageName,
          category: category,
          path: `added-${Date.now()}`,
        });

        // Aktualisiere den State mit den neuesten Daten aus localStorage
        const updatedImages = getAddedImagesByCategory(category);
        setAddedImages(updatedImages);

        // Dispatch Custom Event, um andere Komponenten zu benachrichtigen
        window.dispatchEvent(new CustomEvent("imagesUpdated"));
      }
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input ref is not set");
    }
  };

  const getCategoryName = () => {
    switch (category) {
      case "gemaelde":
        return isEn ? "Paintings" : "Gemälde";
      case "fotografien":
        return isEn ? "Photography" : "Fotografien";
      case "ausstellungen":
        return isEn ? "Exhibitions" : "Ausstellungen";
      default:
        return "";
    }
  };

  return (
    <div className={styles.adminGallery}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className={styles.backButton}
            >
              {lang === "en" ? "← Back" : "← Zurück"}
            </button>
          )}
          <h2 className={styles.heading}>{getCategoryName()}</h2>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className={styles.hiddenFileInput}
          />
          <button
            type="button"
            onClick={handleAddButtonClick}
            className={styles.addButton}
          >
            {isEn ? "Add" : "Hinzufügen"}
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {images.map((img) => (
          <div key={img.id || img.path} className={styles.card}>
            <img
              className={styles.img}
              src={img.url}
              alt={img.name}
              loading="lazy"
            />
            <button
              className={styles.deleteButton}
              onClick={(e) => handleDelete(e, img.path, img.id)}
              aria-label={isEn ? "Delete image" : "Bild löschen"}
            >
              {isEn ? "Delete" : "Löschen"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
