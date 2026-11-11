"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./SpideyEffects.module.css";

const ENABLE_SKILL_SCAN_PULSE = true;
const SCAN_DURATION = 720;
const MAX_ACTIVE_SCANS = 4;

type Scan = { id: number; path: string };

export function SkillScanPulse() {
  const pathname = usePathname();
  const [viewport, setViewport] = useState({ width: 1, height: 1 });
  const [scans, setScans] = useState<Scan[]>([]);

  useEffect(() => {
    if (!ENABLE_SKILL_SCAN_PULSE || pathname !== "/skills") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let sequence = 0;
    const timers: number[] = [];
    const resize = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          const rect = entry.target.getBoundingClientRect();
          const id = ++sequence;
          const startX = rect.left - 10;
          const endX = rect.right + 10;
          const startY = rect.top + rect.height * 0.22;
          const endY = rect.bottom - rect.height * 0.22;
          const path = `M ${startX} ${startY} L ${endX} ${endY}`;
          setScans((current) => [...current.slice(-(MAX_ACTIVE_SCANS - 1)), { id, path }]);
          timers.push(
            window.setTimeout(
              () => setScans((current) => current.filter((scan) => scan.id !== id)),
              SCAN_DURATION,
            ),
          );
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );

    document
      .querySelectorAll("main#main-content article.liquid-glass")
      .forEach((card) => observer.observe(card));
    resize();
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      timers.forEach(window.clearTimeout);
      setScans([]);
    };
  }, [pathname]);

  if (!ENABLE_SKILL_SCAN_PULSE || pathname !== "/skills" || scans.length === 0) {
    return null;
  }

  return (
    <svg
      className={styles.drawOverlay}
      width={viewport.width}
      height={viewport.height}
      viewBox={`0 0 ${viewport.width} ${viewport.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {scans.map((scan) => (
        <path
          key={scan.id}
          pathLength={1}
          className={styles.skillScan}
          d={scan.path}
        />
      ))}
    </svg>
  );
}
