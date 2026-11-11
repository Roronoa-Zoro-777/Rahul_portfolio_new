"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./SpideyEffects.module.css";

const ENABLE_HERO_SKYLINE_PARALLAX = true;
const PARALLAX_DISTANCE = 18;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function HeroSkyline() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [viewport, setViewport] = useState({ width: 1, height: 1 });
  const farLayerRef = useRef<SVGGElement>(null);
  const nearLayerRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!ENABLE_HERO_SKYLINE_PARALLAX || pathname !== "/") return;

    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!pointerQuery.matches || motionQuery.matches) return;

    const hero = document.querySelector<HTMLElement>(".hero-viewport");
    const section = hero?.closest("section");
    if (!hero || !section) return;

    let frameId = 0;
    let heroVisible = false;
    const initialSizeFrame = window.requestAnimationFrame(() =>
      setViewport({ width: window.innerWidth, height: window.innerHeight }),
    );
    const resize = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    const updateParallax = () => {
      frameId = 0;
      if (document.visibilityState === "hidden") return;
      const rect = section.getBoundingClientRect();
      const progress = clamp(
        (window.innerHeight - rect.top) / Math.max(1, rect.height),
        0,
        1,
      );
      const horizontalShift = (PARALLAX_DISTANCE / Math.max(1, window.innerWidth)) * 100;
      const verticalShift = (PARALLAX_DISTANCE / Math.max(1, window.innerHeight)) * 100;
      farLayerRef.current?.setAttribute(
        "transform",
        `translate(${-progress * horizontalShift} ${progress * verticalShift * 0.2})`,
      );
      nearLayerRef.current?.setAttribute(
        "transform",
        `translate(${progress * horizontalShift} ${progress * verticalShift * 0.35})`,
      );
    };
    const onScroll = () => {
      if (!heroVisible || document.visibilityState === "hidden") return;
      if (!frameId) frameId = window.requestAnimationFrame(updateParallax);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        heroVisible = Boolean(entry?.isIntersecting);
        setVisible(heroVisible);
        if (heroVisible) onScroll();
        else if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }
      },
      { threshold: 0.01 },
    );
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden" && frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      } else {
        onScroll();
      }
    };

    observer.observe(hero);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(initialSizeFrame);
    };
  }, [pathname]);

  if (!ENABLE_HERO_SKYLINE_PARALLAX || pathname !== "/") return null;

  return (
    <svg
      className={styles.heroSkyline}
      width={viewport.width}
      height={viewport.height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      data-visible={visible}
    >
      <defs>
        <linearGradient id="spidey-skyline-fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#00f0ff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#e23636" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <g ref={farLayerRef} fill="url(#spidey-skyline-fade)">
        <path d="M0 100V88h5v-8h4v8h3V75h6v13h5v-6h7v6h4V71h5v17h5V78h7v10h6V74h5v14h8v-8h7v8h8V72h6v16h9V78h5v10h6v-12h6v12h8v-7h6v7h6v-9h7v9h5v-14h7v14h7v-8h6v8h6v-11h7v11h8v-7h5v7h8v-13h6v13h9v-9h5v9h6v-11h6v11h8v-8h6v8h7v-12h6v12h8v-9h7v9h8v-13h6v13h9v-10h5v10h6v-12h6v12h8v-8h7v8h8v-10h6v10h9v-7h6v7h8v-12h5v12h7v-8h8v8h6v-11h6v11h9v-9h5v9H0Z" />
      </g>
      <g ref={nearLayerRef} fill="rgba(226,54,54,0.12)">
        <path d="M0 100V84h7V72h5v12h5V78h6v22zm24 0V80h6v-7h6v27zm18 0V69h5v-8h6v17h7v-9h5v31zm24 0V82h6V70h7v12h7v-6h6v24zm27 0V74h6v-9h6v35z" />
      </g>
      <path
        d="M0 99.2h100M18 88h10m16 5h9m18-13h12"
        fill="none"
        stroke="rgba(203,213,225,0.2)"
        strokeWidth="0.12"
      />
    </svg>
  );
}
