import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.title} aria-label="Zabieno">
        Zabieno
      </div>
    </header>
  );
}
