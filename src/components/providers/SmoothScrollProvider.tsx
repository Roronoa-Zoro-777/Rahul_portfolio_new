"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

type Props = { children: ReactNode };

export function SmoothScrollProvider({ children }: Props) {
  const lenisRef = useRef<Lenis | null>(null);
  const listenersRef = useRef(new Set<() => void>());
  const subscribe = useCallback((listener: () => void) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);
  const getSnapshot = useCallback(() => lenisRef.current, []);
  const lenis = useSyncExternalStore(subscribe, getSnapshot, () => null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("lenis", "lenis-smooth");

    const instance = new Lenis({
      lerp: 0.12,
      duration: 1.0,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.2,
    });
    lenisRef.current = instance;
    listenersRef.current.forEach((listener) => listener());

    let rafId = 0;
    const scheduleRaf = () => {
      if (!rafId) rafId = requestAnimationFrame(raf);
    };
    const raf = (time: number) => {
      rafId = 0;
      instance.raf(time);
      if (instance.isScrolling === "smooth") scheduleRaf();
    };
    instance.on("virtual-scroll", scheduleRaf);

    return () => {
      cancelAnimationFrame(rafId);
      instance.off("virtual-scroll", scheduleRaf);
      instance.destroy();
      root.classList.remove("lenis", "lenis-smooth");
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
