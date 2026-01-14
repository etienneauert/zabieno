import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Pagereveal.module.css";

export default function Pagereveal({ onDone, lang = "de" }) {
  const overlayRef = useRef(null);
  const nameRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);
  const [done, setDone] = useState(false);
  const titleText = "Zabieno";
  const subtitleText =
    lang === "en" ? "by Sabine Odebrecht" : "von Sabine Odebrecht";

  useLayoutEffect(() => {
    let cancelled = false;
    let ctx;

    const start = async () => {
      // Ensure webfonts are loaded BEFORE measuring/animating,
      // otherwise the title can render with a fallback font and "swap" after the reveal.
      try {
        if (document.fonts?.load) {
          await document.fonts.load("400 120px Handlee");
        }
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
      } catch {
        // Ignore font loading failures; fallback font will be used.
      }

      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.set(overlayRef.current, { opacity: 1 });

        gsap.set(nameRef.current, {
          position: "fixed",
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          opacity: 0,
          transformOrigin: "50% 50%",
        });

        const titleChars = titleRef.current
          ? Array.from(titleRef.current.querySelectorAll("[data-char]"))
          : [];

        // Compute an end scale based on the *actual* rendered font-size of the title.
        // This keeps the header readable across breakpoints.
        const vw = window.innerWidth;
        const targetTitlePx =
          vw < 480 ? 64 : vw < 768 ? 60 : vw < 1024 ? 56 : 52;
        // Expose the same target size to the header so the handoff is pixel-perfect.
        document.documentElement.style.setProperty(
          "--zabieno-title-px",
          `${targetTitlePx}px`
        );
        const currentTitlePx = titleRef.current
          ? Number.parseFloat(
              window.getComputedStyle(titleRef.current).fontSize
            )
          : 120;
        const endScale = Math.min(
          1,
          Math.max(0.28, targetTitlePx / (currentTitlePx || 120))
        );

        // Make the gradient continuous across the whole word (not repeating per letter)
        if (titleRef.current && titleChars.length > 0) {
          const titleRect = titleRef.current.getBoundingClientRect();
          const titleWidthPx = `${titleRect.width}px`;

          for (const el of titleChars) {
            const r = el.getBoundingClientRect();
            const x = `${r.left - titleRect.left}px`;
            el.style.setProperty("--titleW", titleWidthPx);
            el.style.setProperty("--charX", x);
          }
        }

        gsap.set(titleChars, { yPercent: 120, opacity: 0 });
        gsap.set(subtitleRef.current, { autoAlpha: 0, filter: "blur(3px)" });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            setDone(true);
            if (typeof onDone === "function") onDone();
          },
        });

        tl.to(nameRef.current, { opacity: 1, duration: 0.2 });
        tl.to(titleChars, {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power4.out",
          stagger: 0.045,
        });
        tl.to(
          subtitleRef.current,
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.15"
        );
        tl.to(
          nameRef.current,
          {
            left: "50%",
            top: 18,
            xPercent: -50,
            yPercent: 0,
            scale: endScale,
            transformOrigin: "50% 0%",
            duration: 0.9,
            ease: "power4.inOut",
          },
          "+=1.2"
        );

        // Labels, damit der Handoff garantiert NACH dem Flug passiert (sauberere Animation)
        tl.addLabel("flyStart", "<");
        tl.addLabel("arrived", "flyStart+=0.9");

        // Subtitle nur im Opener zeigen: während des Flugs ausblenden
        tl.to(
          subtitleRef.current,
          {
            autoAlpha: 0,
            filter: "blur(3px)",
            duration: 0.35,
            ease: "power2.in",
          },
          "flyStart"
        );

        // Handoff: erst wenn oben angekommen
        tl.call(
          () => {
            document.documentElement.classList.add("reveal-done");
          },
          null,
          "arrived"
        );

        // Opener-Titel ausblenden (Header bleibt sichtbar)
        tl.to(nameRef.current, { autoAlpha: 0, duration: 0.15 }, "arrived");

        // Erst danach das Overlay ausblenden (User-Delay aktuell 1s)
        tl.to(overlayRef.current, { opacity: 0, duration: 0.6 }, "arrived+=1");
      });
    };

    start();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <>
      <div
        ref={overlayRef}
        className={`${styles.pageRevealOverlay} ${done ? styles.done : ""}`}
      />
      <div
        ref={nameRef}
        className={`${styles.pageRevealName} ${done ? styles.doneName : ""}`}
      >
        <div
          ref={titleRef}
          className={styles.pageRevealTitle}
          aria-label={titleText}
        >
          {Array.from(titleText).map((ch, i) => (
            <span
              key={`${ch}-${i}`}
              data-char
              className={styles.pageRevealChar}
              aria-hidden="true"
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </div>
        <div ref={subtitleRef} className={styles.pageRevealSubtitle}>
          {subtitleText}
        </div>
      </div>
    </>
  );
}
