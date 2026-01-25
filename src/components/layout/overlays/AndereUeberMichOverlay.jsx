import { useMemo, useState } from "react";
import styles from "../Footer.module.css";
import OverlayShell from "./OverlayShell";

import imgTextEsAmor from "../../../assets/zabieno-material/Presse/TextEsAmor.pdf";
import imgKunstZumAnfassen from "../../../assets/zabieno-material/Presse/Kunst_zum_anfassen-1.jpg";
import imgFrauenGebenFarbe from "../../../assets/zabieno-material/Presse/FrauengebendemLegenFarbe.jpg";
import imgKunstBringtFarbe from "../../../assets/zabieno-material/Presse/KunstBringtFarbeInsLeben.jpg";
import imgIchMaleMitAllem from "../../../assets/zabieno-material/Presse/IchMaleMitAllem.jpg";
import imgFaszinierendesFarbsepektakel from "../../../assets/zabieno-material/Presse/Fastzinierendes_Farbsepektakel.jpg";
import imgVierfachKunstvoll from "../../../assets/zabieno-material/Presse/Vierfach kunstvoll-1.jpg";
import imgFarbenpraechtigeBegegnung from "../../../assets/zabieno-material/Presse/FarbprächtigeBegegnung.jpg";
import imgFrauenQuartett from "../../../assets/zabieno-material/Presse/Frauen-Quartett.jpg";

const PRESS = [
  {
    id: "ich-male-mit-allem",
    date: "18. März 2013",
    source: "Paderborn – aktuelle Nachrichten",
    title: "Ich male mit allem",
    asset: imgIchMaleMitAllem,
    assetType: "image",
  },
  {
    id: "es-amor",
    date: "29. Juli 2014",
    source: "Marcela Aiello",
    title: "Y veras que … es amor lo que sangra",
    asset: imgTextEsAmor,
    assetType: "pdf",
  },
  {
    id: "kunst-zum-anfassen",
    date: "30. Februar 2014",
    source: "Paderborner Journal",
    title: "Kunst zum Anfassen",
    asset: imgKunstZumAnfassen,
    assetType: "image",
  },
  {
    id: "frauen-geben-farbe",
    date: "31. Februar 2014",
    source: "Paderborner Journal",
    title: "Frauen geben dem Leben Farbe",
    asset: imgFrauenGebenFarbe,
    assetType: "image",
  },
  {
    id: "kunst-bringt-farbe-ins-leben",
    date: "32. Februar 2014",
    source: "Neue Westfälische",
    title: "Kunst bringt Farbe ins Leben",
    asset: imgKunstBringtFarbe,
    assetType: "image",
  },
  {
    id: "kreativitaet-freier-lauf",
    date: "",
    source: "Mitarbeiterinformationen Stadt Paderborn",
    title: "Der Kreativität freien Lauf",
    asset: null,
    assetType: null,
  },
  {
    id: "faszinierendes-farbspektakel",
    date: "März 2013",
    source: "Neue Westfälische",
    title: "Faszinierendes Farbspektakel",
    asset: imgFaszinierendesFarbsepektakel,
    assetType: "image",
  },
  {
    id: "vierfach-kunstvoll",
    date: "24. Oktober 2012",
    source: "Paderborner Journal",
    title: "Vierfach kunstvoll",
    asset: imgVierfachKunstvoll,
    assetType: "image",
  },
  {
    id: "farbenpraechtige-begegnungen",
    date: "Oktober 2012",
    source: "Neue Westfälische",
    title: "Farbenprächtige Begegnungen",
    asset: imgFarbenpraechtigeBegegnung,
    assetType: "image",
  },
  {
    id: "frauen-quartett",
    date: "Oktober 2012",
    source: "Westfälisches Volksblatt",
    title: "Frauen-Quartett",
    asset: imgFrauenQuartett,
    assetType: "image",
  },
];

export default function AndereUeberMichOverlay() {
  const initialId = useMemo(
    () => PRESS.find((p) => p.asset)?.id ?? PRESS[0]?.id,
    []
  );
  const [activeId, setActiveId] = useState(initialId);
  const active = PRESS.find((p) => p.id === activeId) ?? null;

  return (
    <OverlayShell>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <div className={styles.overlayHeading}>Andere über mich</div>

        <div className={styles.overlayBlock} style={{ width: '100%', maxWidth: '1200px' }}>
          <div className={styles.overlayPressLayout}>
          <div className={styles.overlayPressList}>
            <ul>
              {PRESS.map((p) => {
                const isActive = p.id === activeId;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      className={`${styles.overlayPressButton} ${
                        isActive ? styles.overlayPressButtonActive : ""
                      }`}
                      onClick={() => setActiveId(p.id)}
                    >
                      <span className={styles.overlayListTitle}>{p.title}</span>
                    </button>
                    <br />
                    <span className={styles.overlayPressMeta}>
                      {p.date ? `${p.date}, ` : ""}
                      {p.source}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.overlayPressPreview} aria-live="polite">
            {active?.asset ? (
              active.assetType === "image" ? (
                <img
                  className={styles.overlayPressImage}
                  src={active.asset}
                  alt={`${active.title} – ${active.source}`}
                  loading="lazy"
                />
              ) : (
                <a
                  className={styles.overlayPressPdfLink}
                  href={active.asset}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PDF öffnen
                </a>
              )
            ) : (
              <div className={styles.overlayPressPlaceholder}>
                Kein Bild hinterlegt.
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </OverlayShell>
  );
}
