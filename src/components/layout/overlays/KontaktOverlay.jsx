import styles from "../Footer.module.css";
import OverlayShell from "./OverlayShell";
import sabineKontaktImage from "../../../assets/zabieno-material/Dateien Website Gestaltung/SabineKontakt.jpg";

export default function KontaktOverlay() {
  return (
    <OverlayShell>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <div className={styles.overlayHeading}>Sabine Odebrecht</div>
        <div className={styles.overlaySubheading}>Acrylmalerei</div>

        <img
          src={sabineKontaktImage}
          alt="Sabine Odebrecht"
          style={{
            maxWidth: "100%",
            height: "auto",
            marginTop: "24px",
            marginBottom: "24px",
            borderRadius: "8px",
            maxHeight: "60vh",
            objectFit: "contain",
          }}
        />

        <div className={styles.overlayBlock}>
          Greiteler Weg 30 | 33102 Paderborn
          <br />
          05251 - 8 777 555 | 0160 - 91 78 56 51
          <br />
          zabieno@web.de | www.zabieno.net
        </div>
      </div>
    </OverlayShell>
  );
}
