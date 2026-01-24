import styles from "./FotografienGallery.module.css";
import { useState, useMemo, useEffect } from "react";
import Lightbox from "../../components/ui/Lightbox";
import { isImageDeleted } from "../../utils/deletedImages";
import { getAddedImagesByCategory } from "../../utils/addedImages";

// Vite: sammelt alle Bilddateien im Fotografien-Ordner als URLs
const photoModules = import.meta.glob(
  "/src/assets/zabieno-material/Fotografien/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" }
);

const allPhotos = Object.entries(photoModules)
  .map(([path, url]) => ({
    path,
    url,
    name: path.split("/").pop() ?? path,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "de"));

export default function FotografienGallery() {
  const [selected, setSelected] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Höre auf Storage-Events und Custom Events, um auf Änderungen zu reagieren
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "zabieno_added_images" || e.key === "zabieno_deleted_images") {
        setRefreshKey((prev) => prev + 1);
      }
    };

    const handleImageUpdate = () => {
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("imagesUpdated", handleImageUpdate);
    
    // Auch auf lokale Änderungen reagieren (wenn im selben Tab)
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 1000); // Prüfe jede Sekunde

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("imagesUpdated", handleImageUpdate);
      clearInterval(interval);
    };
  }, []);

  const photos = useMemo(() => {
    const staticPhotos = allPhotos.filter((p) => !isImageDeleted(p.path));
    const addedPhotos = getAddedImagesByCategory("fotografien");
    return [...staticPhotos, ...addedPhotos];
  }, [refreshKey]);

  return (
    <section className={styles.section} aria-label="Fotografien">
      <div className={styles.grid}>
        {photos.map((p) => (
          <div key={p.id || p.path} className={styles.card}>
            <img
              className={styles.img}
              src={p.url}
              alt={p.name}
              loading="lazy"
              onClick={() => setSelected(p)}
            />
          </div>
        ))}
      </div>
      <Lightbox
        isOpen={Boolean(selected)}
        src={selected?.url}
        alt={selected?.name}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

