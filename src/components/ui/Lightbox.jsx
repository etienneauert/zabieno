import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Lightbox.module.css";

export default function Lightbox({ isOpen, src, title, meta, alt, onClose }) {
  const dialogRef = useRef(null);
  const [pxSize, setPxSize] = useState(null);

  const computedMeta = useMemo(() => {
    if (meta) return meta;
    if (pxSize?.w && pxSize?.h) return `${pxSize.w}×${pxSize.h} px`;
    return "";
  }, [meta, pxSize]);

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

  useEffect(() => {
    if (!isOpen || !src) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      setPxSize({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [isOpen, src]);

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
