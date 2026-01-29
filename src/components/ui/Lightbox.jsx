import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Lightbox.module.css";

export default function Lightbox({ isOpen, src, title, alt, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    document.documentElement.classList.add("lightbox-open");
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("lightbox-open");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.backdrop} onMouseDown={() => onClose?.()}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.topbar}>
          {title ? <div className={styles.title}>{title}</div> : null}
        </div>
        <div className={styles.media}>
          <img className={styles.image} src={src} alt={alt ?? ""} />
        </div>
      </div>
    </div>,
    document.body
  );
}
