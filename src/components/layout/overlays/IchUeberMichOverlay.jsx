import styles from "../Footer.module.css";
import OverlayShell from "./OverlayShell";
import vitaPdf from "../../../assets/VitaSabineOdebrechtA5.pdf";

export default function IchUeberMichOverlay({ isEn }) {
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
