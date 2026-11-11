"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./SpiderVerseFX.module.css";

type Rect = { left: number; top: number; right: number; bottom: number };
type Radar = Rect & { id: number };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function getElement(target: EventTarget | null): Element | null {
  return target instanceof Element ? target : null;
}

function cornerWeb(rect: Rect) {
  const { left, top, right } = rect;
  return [
    `M ${left} ${top} q 28 12 48 0 M ${left} ${top} q 12 28 0 48`,
    `M ${right} ${top} q -28 12 -48 0 M ${right} ${top} q -12 28 0 48`,
  ].join(" ");
}

export function SpiderVerseFX() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(true);
  const [motionAvailable, setMotionAvailable] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [radars, setRadars] = useState<Radar[]>([]);
  const [portal, setPortal] = useState<{ id: number; y: number } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const spiderRef = useRef<SVGGElement>(null);
  const anchorsRef = useRef<SVGPathElement>(null);
  const sequenceRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  const active = enabled && motionAvailable;

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateAvailability = () => {
      setMotionAvailable(pointerQuery.matches && !motionQuery.matches);
    };

    updateAvailability();
    pointerQuery.addEventListener("change", updateAvailability);
    motionQuery.addEventListener("change", updateAvailability);

    return () => {
      pointerQuery.removeEventListener("change", updateAvailability);
      motionQuery.removeEventListener("change", updateAvailability);
    };
  }, []);

  useEffect(
    () => () => {
      timersRef.current.forEach(window.clearTimeout);
    },
    [],
  );

  useEffect(() => {
    if (!active) return;

    const svg = svgRef.current;
    if (!svg) return;

    let frameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let targetY = 0;
    let spiderY = 0;
    let spiderVelocity = 0;
    let scrollVelocity = 0;
    let previousScrollY = window.scrollY;
    let previousScrollTime = performance.now();
    let lastPortalTime = 0;
    let lastTime = 0;
    const trackedSections = new Set<Element>();
    const hoveredCards = new WeakMap<Element, number>();

    const scheduleTimeout = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timersRef.current = timersRef.current.filter((item) => item !== timer);
        callback();
      }, delay);
      timersRef.current.push(timer);
      return timer;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      setViewport({ width, height });
    };

    const updateScrollTarget = () => {
      const scrollable = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = clamp(window.scrollY / scrollable, 0, 1);
      targetY = progress * Math.max(0, height - 24);
      if (progressRef.current) {
        progressRef.current.setAttribute(
          "d",
          `M ${width - 11} 0 L ${width - 11} ${targetY}`,
        );
      }

      const now = performance.now();
      const elapsed = Math.max(1, now - previousScrollTime);
      scrollVelocity = (window.scrollY - previousScrollY) / elapsed;
      previousScrollY = window.scrollY;
      previousScrollTime = now;

      if (
        Math.abs(scrollVelocity) > 1.15 &&
        now - lastPortalTime > 850
      ) {
        lastPortalTime = now;
        const id = ++sequenceRef.current;
        setPortal({ id, y: clamp(height * 0.42, 100, height - 100) });
        scheduleTimeout(
          () => setPortal((current) => (current?.id === id ? null : current)),
          420,
        );
      }
    };

    const drawAnchors = () => {
      const visibleRects: Rect[] = [];
      trackedSections.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom > -40 && rect.top < height + 40) {
          visibleRects.push({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }
      });

      const paths = visibleRects.map(cornerWeb);
      for (let index = 0; index < visibleRects.length - 1; index += 1) {
        const from = visibleRects[index];
        const to = visibleRects[index + 1];
        const startX = from.right;
        const startY = (from.top + from.bottom) / 2;
        const endX = to.left;
        const endY = (to.top + to.bottom) / 2;
        const bend = clamp((endY - startY) * 0.18, -70, 70);
        paths.push(
          `M ${startX} ${startY} Q ${(startX + endX) / 2} ${startY + bend} ${endX} ${endY}`,
        );
      }
      anchorsRef.current?.setAttribute("d", paths.join(" "));
    };

    const renderFrame = (time: number) => {
      frameId = 0;
      const elapsed = lastTime ? clamp((time - lastTime) / 16.67, 0.5, 2) : 1;
      lastTime = time;

      const spring = (targetY - spiderY) * 0.105;
      spiderVelocity = (spiderVelocity + spring * elapsed) * Math.pow(0.82, elapsed);
      spiderY += spiderVelocity * elapsed;
      if (Math.abs(targetY - spiderY) < 0.1 && Math.abs(spiderVelocity) < 0.1) {
        spiderY = targetY;
        spiderVelocity = 0;
      } else {
        requestFrame();
      }

      const tilt = clamp(scrollVelocity * 12, -32, 32);
      spiderRef.current?.setAttribute(
        "transform",
        `translate(${width - 11} ${spiderY}) rotate(${tilt})`,
      );
      scrollVelocity *= Math.pow(0.86, elapsed);

      drawAnchors();
      if (
        Math.abs(targetY - spiderY) >= 0.1 ||
        Math.abs(spiderVelocity) >= 0.1
      ) {
        requestFrame();
      }
    };

    const requestFrame = () => {
      if (!frameId) frameId = window.requestAnimationFrame(renderFrame);
    };

    const onScroll = () => {
      updateScrollTarget();
      requestFrame();
    };

    const pulseRadar = (rect: Rect) => {
      const id = ++sequenceRef.current;
      setRadars((current) => [...current.slice(-5), { ...rect, id, rect }]);
      scheduleTimeout(() => {
        setRadars((current) => current.filter((radar) => radar.id !== id));
      }, 700);
    };

    const observed = document.querySelectorAll("main section, main article");
    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            trackedSections.add(entry.target);
            if (!seen.has(entry.target)) {
              seen.add(entry.target);
              const rect = entry.target.getBoundingClientRect();
              pulseRadar({
                left: rect.left,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
              });
            }
          } else {
            trackedSections.delete(entry.target);
            seen.delete(entry.target);
          }
        }
        requestFrame();
      },
      { threshold: 0.12 },
    );
    observed.forEach((element) => observer.observe(element));

    const onCardHover = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const card = getElement(event.target)?.closest(
        "main article, main .liquid-glass, main .metric-glass",
      );
      const related = event.relatedTarget;
      if (
        !card ||
        (related instanceof Node && card.contains(related))
      ) {
        return;
      }
      const now = performance.now();
      if (now - (hoveredCards.get(card) ?? 0) < 900) return;
      hoveredCards.set(card, now);
      const rect = card.getBoundingClientRect();
      pulseRadar({
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
      });
    };

    resize();
    updateScrollTarget();
    requestFrame();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerover", onCardHover, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerover", onCardHover);
    };
  }, [active, pathname]);

  return (
    <>
      {active && (
        <div className={styles.overlay} aria-hidden="true">
          <svg
            ref={svgRef}
            className={styles.visuals}
            width={viewport.width}
            height={viewport.height}
            viewBox={`0 0 ${Math.max(1, viewport.width)} ${Math.max(1, viewport.height)}`}
            preserveAspectRatio="none"
          >
            <path
              ref={progressRef}
              className={styles.progressStrand}
              d={`M ${Math.max(1, viewport.width - 11)} 0 L ${Math.max(1, viewport.width - 11)} 0`}
            />
            <path ref={anchorsRef} className={styles.anchorStrands} d="" />
            <g ref={spiderRef} className={styles.spiderEmblem}>
              <path d="M -2 -5 L -9 -12 M 2 -5 L 9 -12 M -4 -2 L -14 -5 M 4 -2 L 14 -5 M -4 2 L -14 6 M 4 2 L 14 6 M -2 5 L -9 12 M 2 5 L 9 12" />
              <path d="M 0 -7 L 6 -2 L 4 5 L 0 9 L -4 5 L -6 -2 Z" />
              <circle cx="0" cy="-1" r="2" />
            </g>
            {radars.map((radar) => (
              <path
                key={radar.id}
                className={styles.radarPulse}
                d={cornerWeb(radar)}
              />
            ))}
          </svg>
          {portal && (
            <div
              key={portal.id}
              className={styles.portalFlash}
              style={{ top: portal.y }}
            />
          )}
        </div>
      )}
      <button
        type="button"
        className={styles.hudToggle}
        aria-pressed={enabled}
        aria-label={
          motionAvailable
            ? `Turn Spider-Verse effects ${enabled ? "off" : "on"}`
            : `Spider-Verse effects paused by device motion or pointer settings. Turn preference ${enabled ? "off" : "on"}`
        }
        title={
          motionAvailable
            ? "Toggle interactive visual effects"
            : "Effects are automatically paused for touch devices or reduced motion"
        }
        onClick={() => setEnabled((current) => !current)}
      >
        <span className={styles.hudIndicator} />
        {motionAvailable
          ? `SPIDER-FX: ${enabled ? "ON" : "OFF"}`
          : "SPIDER-FX: PAUSED"}
      </button>
    </>
  );
}
