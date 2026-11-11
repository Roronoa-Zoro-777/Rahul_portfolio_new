"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./SpideyEffects.module.css";

const ENABLE_WEB_SWING_ROUTE_TRANSITION = true;
const TRANSITION_DURATION = 680;

export function WebSwingRouteTransition() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const [transitionId, setTransitionId] = useState(0);

  useEffect(() => {
    if (!ENABLE_WEB_SWING_ROUTE_TRANSITION) return;
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    const frame = window.requestAnimationFrame(() => {
      setTransitionId((id) => id + 1);
      timer = window.setTimeout(
        () => setTransitionId(0),
        TRANSITION_DURATION,
      );
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  if (!ENABLE_WEB_SWING_ROUTE_TRANSITION || transitionId === 0) return null;

  return (
    <svg
      key={transitionId}
      className={styles.routeSwing}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path pathLength={1} d="M 100 0 Q 80 38 62 57 T 4 100" />
      <path
        pathLength={1}
        className={styles.routeSwingEcho}
        d="M 100 0 Q 80 38 62 57 T 4 100"
      />
    </svg>
  );
}
