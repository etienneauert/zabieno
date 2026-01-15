import styles from "../Footer.module.css";
import OverlayShell from "./OverlayShell";

export default function KontaktOverlay() {
  return (
    <OverlayShell>
      <div className={styles.overlayHeading}>Sabine Odebrecht</div>
      <div className={styles.overlaySubheading}>Acrylmalerei</div>

      <div className={styles.overlayBlock}>
        Greiteler Weg 30 | 33102 Paderborn
        <br />
        05251 - 8 777 555 | 0160 - 91 78 56 51
        <br />
        zabieno@web.de | www.zabieno.net
      </div>
    </OverlayShell>
  );
}
