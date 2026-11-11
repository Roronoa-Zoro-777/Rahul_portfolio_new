"use client";

import { useEffect, useRef } from "react";
import styles from "./SpideyEffects.module.css";

const ENABLE_BORDER_CRAWLING_SPIDER = true;
const CRAWL_DURATION = 3200;
const SPIDER_SIZE = 22;

function getCard(target: EventTarget | null): Element | null {
  if (!(target instanceof Element)) return null;
  return target.closest("main article.liquid-glass, main .metric-glass");
}

export function BorderCrawlerSpider() {
  const spiderRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ENABLE_BORDER_CRAWLING_SPIDER) return;
    const spider = spiderRef.current;
    if (!spider) return;

    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let target: Element | null = null;
    let startedAt = 0;
    let frameId = 0;

    const hide = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
      target = null;
      spider.dataset.visible = "false";
    };

    const animate = (now: number) => {
      frameId = 0;
      if (
        !target ||
        document.visibilityState === "hidden" ||
        !pointerQuery.matches ||
        motionQuery.matches
      ) {
        hide();
        return;
      }

      const progress = (now - startedAt) / CRAWL_DURATION;
      if (progress >= 1) {
        hide();
        return;
      }

      const rect = target.getBoundingClientRect();
      const width = Math.max(1, rect.width - SPIDER_SIZE);
      const height = Math.max(1, rect.height - SPIDER_SIZE);
      const perimeter = 2 * (width + height);
      const distance = progress * perimeter;
      let x = rect.left + SPIDER_SIZE / 2;
      let y = rect.top + SPIDER_SIZE / 2;
      let angle = 0;

      if (distance < width) {
        x += distance;
      } else if (distance < width + height) {
        x += width;
        y += distance - width;
        angle = 90;
      } else if (distance < 2 * width + height) {
        x += 2 * width + height - distance;
        y += height;
        angle = 180;
      } else {
        y += perimeter - distance;
        angle = 270;
      }

      spider.style.transform = `translate3d(${x - SPIDER_SIZE / 2}px, ${y - SPIDER_SIZE / 2}px, 0) rotate(${angle}deg)`;
      frameId = window.requestAnimationFrame(animate);
    };

    const start = (card: Element | null) => {
      if (!card || !pointerQuery.matches || motionQuery.matches) return;
      if (target === card) return;
      if (frameId) window.cancelAnimationFrame(frameId);
      target = card;
      startedAt = performance.now();
      spider.dataset.visible = "true";
      frameId = window.requestAnimationFrame(animate);
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const card = getCard(event.target);
      const related = event.relatedTarget;
      if (card && !(related instanceof Node && card.contains(related))) start(card);
    };
    const onPointerOut = (event: PointerEvent) => {
      const card = getCard(event.target);
      const related = event.relatedTarget;
      if (card && !(related instanceof Node && card.contains(related)) && card === target) {
        hide();
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      if (!element?.matches(":focus-visible")) return;
      start(getCard(element));
    };
    const onFocusOut = () => hide();
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") hide();
    };

    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      hide();
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (!ENABLE_BORDER_CRAWLING_SPIDER) return null;

  return (
    <svg
      ref={spiderRef}
      className={styles.crawlerSpider}
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-visible="false"
    >
      <path d="M11 9 6 4m7 5 5-5M9 11 3 9m9 0 9-2M9 13l-6 2m9-2 9 2m-11 0-5 5m7-5 5 5" />
      <path d="m12 7 3 4-1 6-2 2-2-2-1-6z" />
      <circle cx="12" cy="12" r="1.1" />
    </svg>
  );
}
