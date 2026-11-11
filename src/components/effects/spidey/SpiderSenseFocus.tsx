"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SpideyEffects.module.css";

const ENABLE_SPIDER_SENSE_FOCUS = true;

type FocusRect = { id: number; left: number; top: number; width: number; height: number };

export function SpiderSenseFocus() {
  const [focusRect, setFocusRect] = useState<FocusRect | null>(null);
  const [viewport, setViewport] = useState({ width: 1, height: 1 });
  const targetRef = useRef<Element | null>(null);
  const sequenceRef = useRef(0);

  useEffect(() => {
    if (!ENABLE_SPIDER_SENSE_FOCUS) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const updateFocus = (target: Element | null) => {
      targetRef.current = target;
      if (!target) {
        setFocusRect(null);
        return;
      }
      const rect = target.getBoundingClientRect();
      setFocusRect({
        id: ++sequenceRef.current,
        left: rect.left - 7,
        top: rect.top - 7,
        width: rect.width + 14,
        height: rect.height + 14,
      });
    };
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      updateFocus(
        target?.matches(":focus-visible") &&
          target.matches("a[href], button:not(:disabled), input, select, textarea, [tabindex]")
          ? target
          : null,
      );
    };
    const onFocusOut = () => updateFocus(null);
    const onResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      updateFocus(targetRef.current);
    };

    onResize();
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!ENABLE_SPIDER_SENSE_FOCUS || !focusRect) return null;

  return (
    <svg
      className={styles.drawOverlay}
      aria-hidden="true"
      width={viewport.width}
      height={viewport.height}
      viewBox={`0 0 ${viewport.width} ${viewport.height}`}
      preserveAspectRatio="none"
    >
      <rect
        key={focusRect.id}
        className={styles.focusPulse}
        x={focusRect.left}
        y={focusRect.top}
        width={focusRect.width}
        height={focusRect.height}
        rx="14"
      />
      <path
        className={styles.focusTicks}
        d={`M ${focusRect.left} ${focusRect.top + 10} l 8 -8 M ${focusRect.left + focusRect.width - 8} ${focusRect.top} l 8 8 M ${focusRect.left} ${focusRect.top + focusRect.height - 10} l 8 8 M ${focusRect.left + focusRect.width - 8} ${focusRect.top + focusRect.height} l 8 -8`}
      />
    </svg>
  );
}
