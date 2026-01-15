import styles from "./Footer.module.css";
import { useEffect, useState } from "react";
import KontaktOverlay from "./overlays/KontaktOverlay";
import IchUeberMichOverlay from "./overlays/IchUeberMichOverlay";
import DatenschutzImpressumOverlay from "./overlays/DatenschutzImpressumOverlay";
import AndereUeberMichOverlay from "./overlays/AndereUeberMichOverlay";

export default function Footer({ lang = "de" }) {
  const isEn = lang === "en";
  const [overlayTarget, setOverlayTarget] = useState(null);

  const renderOverlayContent = () => {
    switch (overlayTarget) {
      case "/kontakt":
        return <KontaktOverlay />;
      case "/ich-ueber-mich":
        return <IchUeberMichOverlay isEn={isEn} />;
      case "/datenschutz-impressum":
        return <DatenschutzImpressumOverlay />;
      case "/andere-ueber-mich":
        return <AndereUeberMichOverlay />;
      default:
        return null;
    }
  };

  const handleNav = (e, href) => {
    // Normaler Link-Use-Cases nicht kaputt machen (neuer Tab, mittlere Maustaste, etc.)
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    e.preventDefault();
    setOverlayTarget(href);
  };

  useEffect(() => {
    if (!overlayTarget) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOverlayTarget(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [overlayTarget]);

  return (
    <footer className={styles.footer}>
      <div
        className={`${styles.whiteOverlay} ${
          overlayTarget ? styles.whiteOverlayOpen : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!overlayTarget}
        onClick={() => setOverlayTarget(null)}
      >
        {renderOverlayContent()}
        <button
          type="button"
          className={styles.overlayBack}
          onClick={(e) => {
            e.stopPropagation();
            // Aktuell sind wir in der SPA immer auf der Home-Page – deshalb Overlay schließen.
            // Falls später echtes Routing kommt, kann hier auf "/" navigiert werden.
            setOverlayTarget(null);
          }}
        >
          {isEn ? "Back to home" : "Zur Startseite"}
        </button>
      </div>
      <nav className={styles.nav} aria-label="Footer Navigation">
        <a
          className={styles.link}
          href="/datenschutz-impressum"
          onClick={(e) => handleNav(e, "/datenschutz-impressum")}
        >
          {isEn ? "Privacy / Imprint" : "Datenschutz / Impressum"}
        </a>
        <a
          className={styles.link}
          href="/ich-ueber-mich"
          onClick={(e) => handleNav(e, "/ich-ueber-mich")}
        >
          {isEn ? "About me" : "Ich über mich"}
        </a>
        <a
          className={styles.link}
          href="/andere-ueber-mich"
          onClick={(e) => handleNav(e, "/andere-ueber-mich")}
        >
          {isEn ? "What others say" : "Andere über mich"}
        </a>
        <a
          className={styles.link}
          href="/kontakt"
          onClick={(e) => handleNav(e, "/kontakt")}
        >
          {isEn ? "Contact" : "Kontakt"}
        </a>
        <a
          className={styles.link}
          href="/kuenstlerlogin"
          onClick={(e) => handleNav(e, "/kuenstlerlogin")}
        >
          {isEn ? "Artist login" : "Künstlerlogin"}
        </a>
      </nav>
    </footer>
  );
}
