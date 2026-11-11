"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./SpideyEffects.module.css";

const ENABLE_CONTACT_WEB_SHIELD = true;
const SHIELD_DURATION = 1900;

type ShieldRect = {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
};

export function ContactWebShield() {
  const pathname = usePathname();
  const [viewport, setViewport] = useState({ width: 1, height: 1 });
  const [shield, setShield] = useState<ShieldRect | null>(null);

  useEffect(() => {
    if (!ENABLE_CONTACT_WEB_SHIELD || pathname !== "/contact") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const form = document.querySelector<HTMLFormElement>("form.contact-glass");
    const status = document.querySelector<HTMLElement>("#contact-form-status");
    if (!form || !status) return;

    let timer = 0;
    let sequence = 0;
    let previousMessage = status.textContent?.trim() ?? "";
    const updateViewport = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    const showShield = () => {
      const rect = form.getBoundingClientRect();
      setShield({
        id: ++sequence,
        left: rect.left - 5,
        top: rect.top - 5,
        width: rect.width + 10,
        height: rect.height + 10,
      });
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setShield(null), SHIELD_DURATION);
    };
    const observer = new MutationObserver(() => {
      const message = status.textContent?.trim() ?? "";
      if (!message) previousMessage = "";
      if (message !== previousMessage && /\bhas been sent\b/i.test(message)) {
        showShield();
      }
      previousMessage = message;
    });

    observer.observe(status, { childList: true, characterData: true, subtree: true });
    updateViewport();
    window.addEventListener("resize", updateViewport, { passive: true });
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("resize", updateViewport);
      setShield(null);
    };
  }, [pathname]);

  if (!ENABLE_CONTACT_WEB_SHIELD || pathname !== "/contact" || !shield) return null;

  const inset = 12;
  const right = shield.left + shield.width;
  const bottom = shield.top + shield.height;
  const path = [
    `M ${shield.left + inset} ${shield.top}`,
    `L ${right - inset} ${shield.top}`,
    `L ${right} ${shield.top + inset}`,
    `L ${right} ${bottom - inset}`,
    `L ${right - inset} ${bottom}`,
    `L ${shield.left + inset} ${bottom}`,
    `L ${shield.left} ${bottom - inset}`,
    `L ${shield.left} ${shield.top + inset}`,
    "Z",
  ].join(" ");

  return (
    <svg
      className={styles.drawOverlay}
      width={viewport.width}
      height={viewport.height}
      viewBox={`0 0 ${viewport.width} ${viewport.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        key={shield.id}
        pathLength={1}
        className={styles.contactShield}
        d={path}
      />
    </svg>
  );
}
