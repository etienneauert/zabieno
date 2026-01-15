import styles from "../Footer.module.css";

export default function OverlayShell({ children }) {
  return (
    <div className={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  );
}
