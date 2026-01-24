import styles from "./AusstellungenGallery.module.css";
import { useState, useMemo, useEffect } from "react";
import Lightbox from "../../components/ui/Lightbox";
import { isImageDeleted } from "../../utils/deletedImages";
import { getAddedImagesByCategory } from "../../utils/addedImages";

// Vite: sammelt alle Ausstellungs-Bilder als URLs (Dateien starten mit "Ausstellung")
const exhibitionModules = import.meta.glob(
  "/src/assets/zabieno-material/Ausstellung*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, import: "default" }
);

const allExhibitions = Object.entries(exhibitionModules)
  .map(([path, url]) => ({
    path,
    url,
    name: path.split("/").pop() ?? path,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "de"));

function parseDisplayTitle(filename) {
  return decodeURIComponent(filename).replace(/\.[^.]+$/, "").trim();
}

export default function AusstellungenGallery() {
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

  const exhibitions = useMemo(() => {
    const staticExhibitions = allExhibitions.filter(
      (p) => !isImageDeleted(p.path)
    );
    const addedExhibitions = getAddedImagesByCategory("ausstellungen");
    return [...staticExhibitions, ...addedExhibitions];
  }, [refreshKey]);

  return (
    <section className={styles.section} aria-label="Ausstellungen">
      <div className={styles.grid}>
        {exhibitions.map((p) => (
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
        title={selected ? parseDisplayTitle(selected.name) : ""}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

