import styles from "./GemaeldeGallery.module.css";
import { useState, useMemo, useEffect } from "react";
import Lightbox from "../../components/ui/Lightbox";
import { isImageDeleted } from "../../utils/deletedImages";
import { getAddedImagesByCategory } from "../../utils/addedImages";

// Vite: sammelt alle Bilddateien im Gemälde-Ordner als URLs
const paintingModules = import.meta.glob(
  "/src/assets/zabieno-material/gemälde/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" }
);

const allPaintings = Object.entries(paintingModules)
  .map(([path, url]) => ({
    path,
    url,
    name: path.split("/").pop() ?? path,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "de"));

function parseDisplayMeta(filename) {
  const base = decodeURIComponent(filename).replace(/\.[^.]+$/, "");
  const m = base.match(/(\d+)\s*[x×]\s*(\d+)/i);
  const meta = m ? `${m[1]}×${m[2]} cm` : "";
  const title = base.replace(/\s*\d+\s*[x×]\s*\d+\s*/i, " ").replace(/\s+/g, " ").trim();
  return { title: title || base, meta };
}

export default function GemaeldeGallery() {
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

  const paintings = useMemo(() => {
    const staticPaintings = allPaintings.filter(
      (p) => !isImageDeleted(p.path)
    );
    const addedPaintings = getAddedImagesByCategory("gemaelde");
    return [...staticPaintings, ...addedPaintings];
  }, [refreshKey]);

  return (
    <section className={styles.section} aria-label="Gemälde">
      <div className={styles.grid}>
        {paintings.map((p) => (
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
        title={selected ? parseDisplayMeta(selected.name).title : ""}
        meta={selected ? parseDisplayMeta(selected.name).meta : ""}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

