import styles from "./AusstellungenGallery.module.css";
import { useState } from "react";
import Lightbox from "../../components/ui/Lightbox";

// Vite: sammelt alle Ausstellungs-Bilder als URLs (Dateien starten mit "Ausstellung")
const exhibitionModules = import.meta.glob(
  "/src/assets/zabieno-material/Ausstellung*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, import: "default" }
);

const exhibitions = Object.entries(exhibitionModules)
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

  return (
    <section className={styles.section} aria-label="Ausstellungen">
      <div className={styles.grid}>
        {exhibitions.map((p) => (
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
        title={selected ? parseDisplayTitle(selected.name) : ""}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

