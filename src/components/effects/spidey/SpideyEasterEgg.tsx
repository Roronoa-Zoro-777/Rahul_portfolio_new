"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SpideyEffects.module.css";

const ENABLE_SPIDEY_KEYBOARD_EASTER_EGG = true;
const ACTIVATION_WORD = "spidey";
const EASTER_EGG_DURATION = 1700;
const KEY_SEQUENCE_TIMEOUT = 1400;

export function SpideyEasterEgg() {
  const [activationId, setActivationId] = useState(0);
  const bufferRef = useRef("");
  const lastKeyTimeRef = useRef(0);

  useEffect(() => {
    if (!ENABLE_SPIDEY_KEYBOARD_EASTER_EGG) return;

    let timer = 0;
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.key.length !== 1
      ) {
        return;
      }
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.matches("input, textarea, select, [role='textbox']"))
      ) {
        return;
      }

      const now = performance.now();
      if (now - lastKeyTimeRef.current > KEY_SEQUENCE_TIMEOUT) {
        bufferRef.current = "";
      }
      lastKeyTimeRef.current = now;
      bufferRef.current = `${bufferRef.current}${event.key.toLowerCase()}`.slice(
        -ACTIVATION_WORD.length,
      );
      if (bufferRef.current !== ACTIVATION_WORD) return;
      bufferRef.current = "";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      setActivationId((id) => id + 1);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setActivationId(0), EASTER_EGG_DURATION);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
    };
  }, []);

  if (!ENABLE_SPIDEY_KEYBOARD_EASTER_EGG || activationId === 0) return null;

  return (
    <svg
      key={activationId}
      className={styles.easterEgg}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path pathLength={1} className={styles.easterThread} d="M 75 0 Q 84 20 60 33" />
      <g className={styles.easterSpider}>
        <path d="M0 0 0-5m0 5-6-4m6 4 6-4m-6 4-8 0m8 0 8 0m-8 0-6 5m6-5 6 5" />
        <path d="m0-4 3 3-1 5-2 2-2-2-1-5z" />
      </g>
    </svg>
  );
}
