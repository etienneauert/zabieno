import styles from "./GemaeldeGallery.module.css";
import { useState } from "react";
import Lightbox from "../../components/ui/Lightbox";

// Vite: sammelt alle Bilddateien im Gemälde-Ordner als URLs
const paintingModules = import.meta.glob(
  "/src/assets/zabieno-material/gemälde/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" }
);

const paintings = Object.entries(paintingModules)
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

  return (
    <section className={styles.section} aria-label="Gemälde">
      <div className={styles.grid}>
        {paintings.map((p) => (
          <div
            key={p.path}
            className={styles.card}
          >
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

