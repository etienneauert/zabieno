import styles from "./Tabs.module.css";

const TABS = [
  { id: "gemaelde", labelDe: "Gemälde", labelEn: "Paintings" },
  { id: "fotografien", labelDe: "Fotografien", labelEn: "Photography" },
  { id: "ausstellungen", labelDe: "Ausstellungen", labelEn: "Exhibitions" },
];

export default function Tabs({ activeTab, onChangeTab, lang = "de" }) {
  const active = activeTab ?? "gemaelde";
  const setActive = onChangeTab ?? (() => {});

  return (
    <nav className={styles.tabs} aria-label="Bereiche">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`${styles.tab} ${active === t.id ? styles.active : ""}`}
          aria-pressed={active === t.id}
          onClick={() => setActive(t.id)}
        >
          {lang === "en" ? t.labelEn : t.labelDe}
        </button>
      ))}
    </nav>
  );
}
