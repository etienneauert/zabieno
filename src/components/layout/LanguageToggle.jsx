import styles from "./LanguageToggle.module.css";

export default function LanguageToggle({ lang, onToggle }) {
  const next = lang === "de" ? "EN" : "DE";
  return (
    <button type="button" className={styles.button} onClick={onToggle}>
      {next}
    </button>
  );
}

