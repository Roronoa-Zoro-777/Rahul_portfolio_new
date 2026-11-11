"use client";

import { useEffect, useState } from "react";
import styles from "./SpideyEffects.module.css";

const ENABLE_SUIT_WEAVE_TEXTURE = true;

export function SuitWeaveTexture() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!ENABLE_SUIT_WEAVE_TEXTURE) return;
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setActive(pointerQuery.matches && !motionQuery.matches);
    update();
    pointerQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    return () => {
      pointerQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  if (!ENABLE_SUIT_WEAVE_TEXTURE) return null;

  return (
    <div
      className={styles.suitWeave}
      data-animated={active}
      aria-hidden="true"
    />
  );
}
