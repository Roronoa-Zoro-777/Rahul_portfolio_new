"use client";

import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { useEffect, type RefObject } from "react";

export function getSectionScrollProgress(section: HTMLElement | null): number {
  if (!section) return 0;
  const scrollable = section.offsetHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return Math.min(
    1,
    Math.max(0, -section.getBoundingClientRect().top / scrollable),
  );
}

export function useScrollSectionProgress(
  sectionRef: RefObject<HTMLElement | null>,
  onScroll: (progress: number) => void,
  enabled = true,
) {
  const lenis = useLenis();

  useEffect(() => {
    if (!enabled) return;

    let frameId = 0;
    const update = () => {
      onScroll(getSectionScrollProgress(sectionRef.current));
    };

    const handleScroll = () => {
      if (lenis) {
        update();
      } else {
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(update);
      }
    };

    if (lenis) {
      lenis.on("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }
    
    handleScroll();

    return () => {
      if (lenis) lenis.off("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frameId);
    };
  }, [lenis, enabled, onScroll, sectionRef]);
}
