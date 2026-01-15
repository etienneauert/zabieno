import styles from "./Footer.module.css";
import { useEffect, useState } from "react";
import vitaPdf from "../../assets/VitaSabineOdebrechtA5.pdf";

function OverlayShell({ children }) {
  return (
    <div className={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  );
}

function KontaktOverlay() {
  return (
    <OverlayShell>
      <div className={styles.overlayHeading}>Sabine Odebrecht</div>
      <div className={styles.overlaySubheading}>Acrylmalerei</div>

      <div className={styles.overlayBlock}>
        Sabine Odebrecht
        <br />
        Greiteler Weg 30 | 33102 Paderborn
        <br />
        05251 - 8 777 555 | 0160 - 91 78 56 51
        <br />
        zabieno@web.de | www.zabieno.net
      </div>
    </OverlayShell>
  );
}

function IchUeberMichOverlay({ isEn }) {
  return (
    <OverlayShell>
      <div className={styles.overlayHeading}>Ich über mich</div>

      <div className={styles.overlayBlock}>
        Geboren, aufgewachsen, zur Schule gegangen,
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unendlich viele Menschen und
        Möglichkeiten kennengelernt,
        <br />
        Erfahrungen gesammelt, auf die Nase gefallen,
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;wieder aufgestanden,
        <br />
        weitergemacht
      </div>

      <div className={styles.overlayPdf}>
        <a
          className={styles.overlayPdfLink}
          href={vitaPdf}
          target="_blank"
          rel="noopener noreferrer"
        >
          {isEn ? "CV (PDF)" : "Vita (PDF)"}
        </a>
      </div>
    </OverlayShell>
  );
}

function DatenschutzImpressumOverlay() {
  return null;
}

function AndereUeberMichOverlay() {
  return null;
}

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
