import styles from "./FotografienGallery.module.css";
import { useState } from "react";
import Lightbox from "../../components/ui/Lightbox";

// Vite: sammelt alle Bilddateien im Fotografien-Ordner als URLs
const photoModules = import.meta.glob(
  "/src/assets/zabieno-material/Fotografien/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" }
);

const photos = Object.entries(photoModules)
  .map(([path, url]) => ({
    path,
    url,
    name: path.split("/").pop() ?? path,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "de"));

export default function FotografienGallery() {
  const [selected, setSelected] = useState(null);

  return (
    <section className={styles.section} aria-label="Fotografien">
      <div className={styles.grid}>
        {photos.map((p) => (
          <div key={p.path} className={styles.card}>
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

