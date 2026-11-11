"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./SpideyEffects.module.css";

const ENABLE_WEB_ZIP_REVEAL = true;
const REVEAL_DURATION = 760;
const MAX_ACTIVE_REVEALS = 6;

type ZipPulse = {
  id: number;
  path: string;
  x: number;
  y: number;
};

export function WebZipReveal() {
  const pathname = usePathname();
  const [size, setSize] = useState({ width: 1, height: 1 });
  const [pulses, setPulses] = useState<ZipPulse[]>([]);

  useEffect(() => {
    if (!ENABLE_WEB_ZIP_REVEAL) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let sequence = 0;
    const timers: number[] = [];
    const resize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          const rect = entry.target.getBoundingClientRect();
          const y = rect.top + Math.min(rect.height / 2, 36);
          const x = Math.max(12, rect.left);
          const endX = Math.min(window.innerWidth - 12, x + Math.min(rect.width, 56));
          const id = ++sequence;
          const midpoint = (x + endX) / 2;
          const path = `M ${Math.max(0, x - 34)} ${y - 20} Q ${midpoint} ${y - 2} ${endX} ${y}`;
          setPulses((current) => [
            ...current.slice(-(MAX_ACTIVE_REVEALS - 1)),
            { id, path, x: endX, y },
          ]);
          const timer = window.setTimeout(
            () => setPulses((current) => current.filter((pulse) => pulse.id !== id)),
            REVEAL_DURATION,
          );
          timers.push(timer);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );

    document
      .querySelectorAll("main h1, main h2, main article")
      .forEach((element) => observer.observe(element));
    const initialSizeFrame = window.requestAnimationFrame(resize);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(initialSizeFrame);
      timers.forEach(window.clearTimeout);
      setPulses([]);
    };
  }, [pathname]);

  if (!ENABLE_WEB_ZIP_REVEAL || pulses.length === 0) return null;

  return (
    <svg
      className={styles.drawOverlay}
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {pulses.map((pulse) => (
        <g key={pulse.id} className={styles.zipPulse}>
          <path pathLength={1} d={pulse.path} />
          <circle cx={pulse.x} cy={pulse.y} r="2" />
        </g>
      ))}
    </svg>
  );
}
