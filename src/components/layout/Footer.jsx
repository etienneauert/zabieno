import styles from "./Footer.module.css";

export default function Footer({ lang = "de" }) {
  const isEn = lang === "en";
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav} aria-label="Footer Navigation">
        <a className={styles.link} href="/datenschutz-impressum">
          {isEn ? "Privacy / Imprint" : "Datenschutz / Impressum"}
        </a>
        <a className={styles.link} href="/ich-ueber-mich">
          {isEn ? "About me" : "Ich über mich"}
        </a>
        <a className={styles.link} href="/andere-ueber-mich">
          {isEn ? "What others say" : "Andere über mich"}
        </a>
        <a className={styles.link} href="/kontakt">
          {isEn ? "Contact" : "Kontakt"}
        </a>
        <a className={styles.link} href="/kuenstlerlogin">
          {isEn ? "Artist login" : "Künstlerlogin"}
        </a>
      </nav>
    </footer>
  );
}
