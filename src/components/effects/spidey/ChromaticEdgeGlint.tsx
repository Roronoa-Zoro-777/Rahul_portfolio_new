"use client";

import { useEffect } from "react";
import styles from "./SpideyEffects.module.css";

const ENABLE_CHROMATIC_EDGE_GLINT = true;

export function ChromaticEdgeGlint() {
  useEffect(() => {
    if (!ENABLE_CHROMATIC_EDGE_GLINT) return;
    document.documentElement.classList.add(styles.chromaticEnabled);
    return () => document.documentElement.classList.remove(styles.chromaticEnabled);
  }, []);

  return null;
}
