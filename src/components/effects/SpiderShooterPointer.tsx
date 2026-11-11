"use client";

import { useEffect, useRef } from "react";
import styles from "./SpiderShooterPointer.module.css";

// Easing rate in inverse seconds; larger values track the pointer more tightly.
const FOLLOW_SPEED = 20;
// Snap at sub-pixel distances to prevent residual drift.
const SNAP_DISTANCE = 0.1;
// Disable easing while keeping the pointer's tracking and rendering behavior.
const SMOOTHING_ENABLED = true;
const HOVER_LIFT_PX = 38;
const CURSOR_HALF_SIZE_PX = 19;

const SPOKES = 12;
const RINGS = 9;
const RADIUS_MIN = 150;
const RADIUS_MAX = 220;
const SMALL_SCREEN_RADIUS_SCALE = 0.3;
const SPOKE_ANGLE_JITTER = 0.03;
const SPOKE_LENGTH_MIN = 0.92;
const SPOKE_LENGTH_MAX = 1.08;
const RING_POINT_JITTER = 0.03;
const RING_GROWTH = 1.15;
const RING_SAG = 0.12;
const HUB_RADII = [4, 7, 10];
const ANCHOR_THREADS = 4;
const ANCHOR_EXTENSION = 0.52;
const ANCHOR_SAG = 16;
const MAX_WEBS = 5;
const MAX_DPR = 2;
const SHOT_DURATION = 150;
const SPOKE_DURATION = 250;
const RING_DELAY = 40;
const RING_DRAW_DURATION = 220;
const SETTLE_DURATION = 500;
const WEB_HOLD_DURATION = 2000;
const WEB_FADE_DURATION = 600;
const REDUCED_MOTION_DURATION = 500;
const SPOKE_LINE_WIDTH = 1.2;
const RING_LINE_WIDTH = 0.7;
const ANCHOR_LINE_WIDTH = 1;
const SHOT_LINE_WIDTH = 0.8;
const LINE_COLOR = "rgba(255, 255, 255, 0.85)";
const OUTER_LINE_COLOR = "rgba(255, 255, 255, 0.52)";
const SILVER_GLOW = "rgba(203, 213, 225, 0.42)";
const HUB_COLOR = "rgba(255, 255, 255, 0.92)";
const SEGMENT_STEPS = 12;

type Point = { x: number; y: number };
type Spoke = {
  angle: number;
  endpoint: Point;
  control: Point;
  ringPoints: Point[];
};
type WebSegment = { start: Point; control: Point; end: Point };
type WebRing = { segments: WebSegment[] };
type AnchorThread = { start: Point; control: Point; end: Point };
type WebShot = {
  origin: Point;
  impact: Point;
  startedAt: number;
  spokes: Spoke[];
  rings: WebRing[];
  anchors: AnchorThread[];
  radius: number;
  reducedMotion: boolean;
};

declare global {
  interface Window {
    drawTestWeb?: () => void;
  }
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const easeOut = (value: number) => 1 - (1 - clamp(value, 0, 1)) ** 3;

const getPoint = (center: Point, angle: number, radius: number): Point => ({
  x: center.x + Math.cos(angle) * radius,
  y: center.y + Math.sin(angle) * radius,
});

function makeRingSegments(points: Point[], center: Point): WebSegment[] {
  return points.map((start, index) => {
    const end = points[(index + 1) % points.length];
    const midpoint = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
    const towardCenter = { x: center.x - midpoint.x, y: center.y - midpoint.y };
    const centerDistance = Math.hypot(towardCenter.x, towardCenter.y) || 1;
    const segmentLength = Math.hypot(end.x - start.x, end.y - start.y);
    const pull = segmentLength * RING_SAG;

    return {
      start,
      end,
      control: {
        x: midpoint.x + (towardCenter.x / centerDistance) * pull,
        y: midpoint.y + (towardCenter.y / centerDistance) * pull,
      },
    };
  });
}

function getRingRadii(radius: number): number[] {
  const firstRadius = HUB_RADII[HUB_RADII.length - 1] + 8;
  const gaps = Array.from({ length: RINGS }, (_, index) => RING_GROWTH ** index);
  const totalGap = gaps.reduce((sum, gap) => sum + gap, 0);
  let currentRadius = firstRadius;

  return gaps.map((gap, index) => {
    currentRadius +=
      ((radius - firstRadius) * gap) / totalGap;
    return index === RINGS - 1 ? radius : currentRadius;
  });
}

function precomputeOrbWeb(
  impact: Point,
  origin: Point,
  startedAt: number,
  reducedMotion: boolean,
  viewportWidth: number,
  viewportHeight: number,
): WebShot {
  const rawRadius = Math.min(viewportWidth, viewportHeight) * SMALL_SCREEN_RADIUS_SCALE;
  const radius =
    rawRadius < RADIUS_MIN ? rawRadius : clamp(rawRadius, RADIUS_MIN, RADIUS_MAX);
  const angleSpacing = (Math.PI * 2) / SPOKES;
  const ringRadii = getRingRadii(radius);
  const spokeAngles = Array.from({ length: SPOKES }, (_, index) => {
    const jitter = (Math.random() * 2 - 1) * angleSpacing * SPOKE_ANGLE_JITTER;
    return index * angleSpacing + jitter;
  });
  const spokes = spokeAngles.map((angle) => {
    const length =
      radius * (SPOKE_LENGTH_MIN + Math.random() * (SPOKE_LENGTH_MAX - SPOKE_LENGTH_MIN));
    const lengthScale = length / radius;
    const endpoint = getPoint(impact, angle, length);
    const normal = { x: -Math.sin(angle), y: Math.cos(angle) };
    const bow = (Math.random() * 2 - 1) * 1.5;

    return {
      angle,
      endpoint,
      control: {
        x: (impact.x + endpoint.x) / 2 + normal.x * bow,
        y: (impact.y + endpoint.y) / 2 + normal.y * bow,
      },
      ringPoints: ringRadii.map((ringRadius) => {
        const jitterScale = 1 + (Math.random() * 2 - 1) * RING_POINT_JITTER;
        return getPoint(impact, angle, ringRadius * lengthScale * jitterScale);
      }),
    };
  });

  const rings = ringRadii.map((_, ringIndex) => ({
    segments: makeRingSegments(
      spokes.map((spoke) => spoke.ringPoints[ringIndex]),
      impact,
    ),
  }));
  const anchors = Array.from({ length: ANCHOR_THREADS }, (_, index) => {
    const spokeIndex = Math.floor((index * SPOKES) / ANCHOR_THREADS);
    const start = spokes[spokeIndex].endpoint;
    const angle = spokes[spokeIndex].angle;
    const end = getPoint(impact, angle, radius * (1 + ANCHOR_EXTENSION));
    const midpoint = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
    const bow = (index % 2 === 0 ? 1 : -1) * ANCHOR_SAG;

    return {
      start,
      control: { x: midpoint.x, y: midpoint.y + bow },
      end,
    };
  });

  return { origin, impact, startedAt, spokes, rings, anchors, radius, reducedMotion };
}

function drawQuadratic(
  context: CanvasRenderingContext2D,
  start: Point,
  control: Point,
  end: Point,
  progress: number,
  vibration = 0,
  vibrationPhase = 0,
  vibrationNormal: Point = { x: 0, y: 0 },
) {
  if (progress <= 0) return;
  const steps = Math.max(2, Math.ceil(SEGMENT_STEPS * progress));
  context.beginPath();
  for (let index = 0; index <= steps; index += 1) {
    const t = progress * (index / steps);
    const inverse = 1 - t;
    const x =
      inverse * inverse * start.x +
      2 * inverse * t * control.x +
      t * t * end.x;
    const y =
      inverse * inverse * start.y +
      2 * inverse * t * control.y +
      t * t * end.y;
    const ripple = Math.sin(t * Math.PI * 6 - vibrationPhase) * vibration * Math.sin(Math.PI * t);
    if (index === 0) {
      context.moveTo(x + vibrationNormal.x * ripple, y + vibrationNormal.y * ripple);
    } else {
      context.lineTo(x + vibrationNormal.x * ripple, y + vibrationNormal.y * ripple);
    }
  }
  context.stroke();
}

function drawOrbWeb(
  context: CanvasRenderingContext2D,
  shot: WebShot,
  now: number,
): boolean {
  const elapsed = now - shot.startedAt;
  const buildDuration =
    SHOT_DURATION +
    SPOKE_DURATION +
    (RINGS - 1) * RING_DELAY +
    RING_DRAW_DURATION +
    100;
  const totalDuration = shot.reducedMotion
    ? REDUCED_MOTION_DURATION
    : buildDuration + WEB_HOLD_DURATION + WEB_FADE_DURATION;
  if (elapsed >= totalDuration) return false;

  const fade = shot.reducedMotion
    ? 1 - easeOut(elapsed / REDUCED_MOTION_DURATION)
    : elapsed <= buildDuration + WEB_HOLD_DURATION
      ? 1
      : 1 - (elapsed - buildDuration - WEB_HOLD_DURATION) / WEB_FADE_DURATION;

  context.save();
  context.globalAlpha = clamp(fade, 0, 1);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = LINE_COLOR;
  context.fillStyle = HUB_COLOR;
  context.shadowColor = SILVER_GLOW;
  context.shadowBlur = 4;

  if (!shot.reducedMotion) {
    const shotProgress = easeOut(elapsed / SHOT_DURATION);
    if (shotProgress > 0 && shotProgress < 1) {
      const midpoint = {
        x: (shot.origin.x + shot.impact.x) / 2,
        y: (shot.origin.y + shot.impact.y) / 2 + 2,
      };
      context.lineWidth = SHOT_LINE_WIDTH;
      drawQuadratic(context, shot.origin, midpoint, shot.impact, shotProgress);
    }

    const spokeProgress = easeOut((elapsed - SHOT_DURATION) / SPOKE_DURATION);
    if (spokeProgress > 0) {
      const settleElapsed = elapsed - SHOT_DURATION - SPOKE_DURATION;
      const settleStrength =
        settleElapsed > 0 ? Math.max(0, 1 - settleElapsed / SETTLE_DURATION) : 0;
      const wobble = Math.sin(settleElapsed * 0.045) * 1.6 * settleStrength;
      context.lineWidth = SPOKE_LINE_WIDTH;
      context.strokeStyle = LINE_COLOR;

      shot.spokes.forEach((spoke) => {
        const baseMidpoint = {
          x: (shot.impact.x + spoke.endpoint.x) / 2,
          y: (shot.impact.y + spoke.endpoint.y) / 2,
        };
        const normal = { x: -Math.sin(spoke.angle), y: Math.cos(spoke.angle) };
        const end = {
          x: shot.impact.x + (spoke.endpoint.x - shot.impact.x) * spokeProgress,
          y: shot.impact.y + (spoke.endpoint.y - shot.impact.y) * spokeProgress,
        };
        const control = {
          x:
            baseMidpoint.x +
            (spoke.control.x - baseMidpoint.x) * spokeProgress,
          y:
            baseMidpoint.y +
            (spoke.control.y - baseMidpoint.y) * spokeProgress,
        };
        drawQuadratic(
          context,
          shot.impact,
          control,
          end,
          1,
          wobble,
          settleElapsed * 0.045,
          normal,
        );
      });

      shot.anchors.forEach((anchor, index) => {
        const anchorProgress = easeOut(
          (elapsed - SHOT_DURATION - SPOKE_DURATION - 100 - index * 24) / 180,
        );
        if (anchorProgress <= 0) return;
        context.lineWidth = ANCHOR_LINE_WIDTH;
        context.globalAlpha = clamp(fade * 0.82, 0, 1);
        drawQuadratic(
          context,
          anchor.start,
          anchor.control,
          anchor.end,
          anchorProgress,
        );
      });
    }

    shot.rings.forEach((ring, ringIndex) => {
      const ringStart = SHOT_DURATION + SPOKE_DURATION + ringIndex * RING_DELAY;
      const ringProgress = easeOut((elapsed - ringStart) / RING_DRAW_DURATION);
      if (ringProgress <= 0) return;

      context.lineWidth = RING_LINE_WIDTH;
      context.strokeStyle =
        ringIndex >= RINGS - 2 ? OUTER_LINE_COLOR : LINE_COLOR;
      context.globalAlpha = clamp(fade * (0.9 - ringIndex * 0.035), 0, 1);

      const segmentCount = ring.segments.length;
      const drawnSegments = ringProgress * segmentCount;
      const completeSegments = Math.floor(drawnSegments);
      const partialProgress = drawnSegments - completeSegments;

      for (let segment = 0; segment < Math.min(completeSegments, segmentCount); segment += 1) {
        const segmentData = ring.segments[segment];
        drawQuadratic(context, segmentData.start, segmentData.control, segmentData.end, 1);
      }

      if (completeSegments < segmentCount && partialProgress > 0) {
        const segmentData = ring.segments[completeSegments];
        drawQuadratic(
          context,
          segmentData.start,
          segmentData.control,
          segmentData.end,
          partialProgress,
        );
      }
    });
  } else {
    context.lineWidth = SPOKE_LINE_WIDTH;
    shot.spokes.forEach((spoke) => {
      drawQuadratic(context, shot.impact, spoke.control, spoke.endpoint, 1);
    });

    shot.anchors.forEach((anchor) => {
      context.lineWidth = ANCHOR_LINE_WIDTH;
      drawQuadratic(context, anchor.start, anchor.control, anchor.end, 1);
    });

    shot.rings.forEach((ring, ringIndex) => {
      context.lineWidth = RING_LINE_WIDTH;
      context.globalAlpha = fade * (0.9 - ringIndex * 0.035);
      ring.segments.forEach((segment) => {
        drawQuadratic(context, segment.start, segment.control, segment.end, 1);
      });
    });
  }

  context.globalAlpha = clamp(fade, 0, 1);
  context.lineWidth = 0.65;
  HUB_RADII.forEach((radius) => {
    context.beginPath();
    context.arc(shot.impact.x, shot.impact.y, radius, 0, Math.PI * 2);
    context.stroke();
  });
  context.fillStyle = HUB_COLOR;
  context.beginPath();
  context.arc(shot.impact.x, shot.impact.y, 1.5, 0, Math.PI * 2);
  context.fill();
  context.restore();
  return true;
}

export function SpiderShooterPointer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !cursor || !context) return;
    const activeCanvas = canvas;
    const activeCursor = cursor;
    const activeContext = context;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shots: WebShot[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frameId = 0;
    let cursorVisible = false;
    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;
    let targetHovering = false;
    let hasCursorPosition = false;
    let lastCursorFrameTime = 0;
    let isFinePointer = finePointer.matches;
    let isReducedMotion = reducedMotion.matches;
    let hasPointerPosition = false;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      activeCanvas.width = Math.round(width * ratio);
      activeCanvas.height = Math.round(height * ratio);
      activeCanvas.style.width = `${width}px`;
      activeCanvas.style.height = `${height}px`;
      activeContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      queueFrame();
    };

    const queueFrame = () => {
      if (!frameId) frameId = window.requestAnimationFrame(renderFrame);
    };

    const addShot = (impact: Point, origin: Point) => {
      if (shots.length >= MAX_WEBS) shots.shift();
      shots.push(
        precomputeOrbWeb(
          impact,
          origin,
          performance.now(),
          isReducedMotion,
          width,
          height,
        ),
      );
      queueFrame();
    };

    function renderFrame(now: number) {
      frameId = 0;
      activeContext.clearRect(0, 0, width, height);

      let cursorMoving = false;
      activeCursor.dataset.visible = cursorVisible ? "true" : "false";
      activeCursor.dataset.hovering = targetHovering ? "true" : "false";
      if (targetHovering) {
        const lift = Math.min(HOVER_LIFT_PX, targetY - CURSOR_HALF_SIZE_PX);
        activeCursor.style.setProperty("--hover-lift", `${lift}px`);
      }
      if (isFinePointer && cursorVisible) {
        const deltaSeconds =
          lastCursorFrameTime > 0 ? (now - lastCursorFrameTime) / 1000 : 1 / 60;
        lastCursorFrameTime = now;

        if (
          !hasCursorPosition ||
          !SMOOTHING_ENABLED ||
          isReducedMotion
        ) {
          cursorX = targetX;
          cursorY = targetY;
          hasCursorPosition = true;
        } else {
          const follow = 1 - Math.exp(-FOLLOW_SPEED * deltaSeconds);
          cursorX += (targetX - cursorX) * follow;
          cursorY += (targetY - cursorY) * follow;
        }
        const remaining = Math.hypot(targetX - cursorX, targetY - cursorY);
        if (remaining <= SNAP_DISTANCE) {
          cursorX = targetX;
          cursorY = targetY;
        } else {
          cursorMoving = true;
        }
        activeCursor.style.transform =
          `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      } else {
        lastCursorFrameTime = 0;
      }

      for (let index = shots.length - 1; index >= 0; index -= 1) {
        if (!drawOrbWeb(activeContext, shots[index], now)) shots.splice(index, 1);
      }

      if (cursorMoving || shots.length > 0) queueFrame();
    }

    const setPointerAvailability = () => {
      isFinePointer = finePointer.matches;
      isReducedMotion = reducedMotion.matches;
      document.body.classList.toggle(
        styles.cursorEnabled,
        isFinePointer,
      );
      activeCursor.dataset.visible = "false";
      activeCursor.dataset.pressed = "false";
      cursorVisible = false;
      targetHovering = false;
      lastCursorFrameTime = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !isFinePointer) return;
      const coalescedEvents = event.getCoalescedEvents?.();
      const latestEvent =
        coalescedEvents && coalescedEvents.length > 0
          ? coalescedEvents[coalescedEvents.length - 1]
          : event;
      targetX = latestEvent.clientX;
      targetY = latestEvent.clientY;
      hasPointerPosition = true;
      cursorVisible = true;
      const element = event.target instanceof Element ? event.target : null;
      targetHovering = Boolean(element?.closest(
        "a[href], button:not(:disabled), [role='button'], input, select, textarea",
      ));
      if (!hasCursorPosition) {
        cursorX = targetX;
        cursorY = targetY;
        hasCursorPosition = true;
      }
      queueFrame();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) {
        return;
      }

      const previous = { x: targetX, y: targetY };
      const hadPreviousPosition = hasPointerPosition;
      if (event.pointerType === "mouse" && isFinePointer) {
        targetX = event.clientX;
        targetY = event.clientY;
        hasPointerPosition = true;
        if (!hasCursorPosition) {
          cursorX = targetX;
          cursorY = targetY;
          hasCursorPosition = true;
        }
        cursorVisible = true;
        activeCursor.dataset.visible = "true";
        activeCursor.dataset.pressed = "true";
      }

      const impact = { x: event.clientX, y: event.clientY };
      const distanceFromPrevious = Math.hypot(
        previous.x - impact.x,
        previous.y - impact.y,
      );
      const origin =
        event.pointerType === "mouse" &&
        hadPreviousPosition &&
        distanceFromPrevious > 70
          ? previous
          : { x: width - 18, y: height - 18 };

      addShot(impact, origin);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType === "mouse") activeCursor.dataset.pressed = "false";
    };

    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget) return;
      cursorVisible = false;
      targetHovering = false;
      queueFrame();
    };

    const onWindowFocus = () => {
      if (!cursorVisible || !hasPointerPosition) return;
      cursorX = targetX;
      cursorY = targetY;
      lastCursorFrameTime = 0;
      queueFrame();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
        lastCursorFrameTime = 0;
        return;
      }
      onWindowFocus();
      if (shots.length > 0) queueFrame();
    };

    resize();
    setPointerAvailability();
    const previousDrawTestWeb = window.drawTestWeb;
    const drawTestWeb = () => {
      addShot(
        { x: width / 2, y: height / 2 },
        { x: width - 18, y: height - 18 },
      );
    };
    window.drawTestWeb = drawTestWeb;
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, {
      passive: true,
      capture: true,
    });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("focus", onWindowFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    finePointer.addEventListener("change", setPointerAvailability);
    reducedMotion.addEventListener("change", setPointerAvailability);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("focus", onWindowFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      finePointer.removeEventListener("change", setPointerAvailability);
      reducedMotion.removeEventListener("change", setPointerAvailability);
      document.body.classList.remove(styles.cursorEnabled);
      if (window.drawTestWeb === drawTestWeb) {
        if (previousDrawTestWeb) window.drawTestWeb = previousDrawTestWeb;
        else delete window.drawTestWeb;
      }
      activeContext.clearRect(0, 0, width, height);
    };
  }, []);

  return (
    <div className={styles.overlay} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.webCanvas} />
      <div ref={cursorRef} className={styles.cursorRing} data-visible="false">
        <div className={styles.cursorLift}>
          <div className={styles.cursorFace}>
            <svg
              className={styles.cursorWebSymbol}
              viewBox="0 0 40 40"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient
                  id="spider-metal"
                  x1="5"
                  y1="5"
                  x2="35"
                  y2="35"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#F8FAFC" />
                  <stop offset=".48" stopColor="#64748B" />
                  <stop offset="1" stopColor="#CBD5E1" />
                </linearGradient>
                <linearGradient
                  id="spider-shell"
                  x1="15"
                  y1="13"
                  x2="25"
                  y2="28"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#334155" />
                  <stop offset=".55" stopColor="#080B12" />
                  <stop offset="1" stopColor="#02040A" />
                </linearGradient>
                <radialGradient
                  id="spider-eye"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientTransform="matrix(1.2 1.7 -1.7 1.2 16.8 15.6)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FCA5A5" />
                  <stop offset="1" stopColor="#E23636" />
                </radialGradient>
              </defs>
              <g className={styles.webLines} stroke="url(#spider-metal)">
                <circle cx="20" cy="20" r="6" />
                <circle cx="20" cy="20" r="12" />
                <circle cx="20" cy="20" r="18" />
                <path d="M20 1v38M1 20h38M6.56 6.56l26.88 26.88M33.44 6.56 6.56 33.44" />
              </g>
              <g className={styles.spiderLegs} stroke="url(#spider-metal)">
                <path d="m17 16.8-4-3.7-3.1.1-2.7-2.4M16.4 18.5l-5.2-1.9-3 .9-3.1-1.4M16.4 20.4l-5.5.3-2.5 2.1-3.4-.2M17 22l-4.5 3.2-.9 3.1-3 1.5M23 16.8l4-3.7 3.1.1 2.7-2.4M23.6 18.5l5.2-1.9 3 .9 3.1-1.4M23.6 20.4l5.5.3 2.5 2.1 3.4-.2M23 22l4.5 3.2.9 3.1 3 1.5" />
              </g>
              <path
                className={styles.spiderAbdomen}
                d="M20 17.4c-2.5 0-4.1 2-4.1 4.9 0 3 1.8 5.2 4.1 5.2s4.1-2.2 4.1-5.2c0-2.9-1.6-4.9-4.1-4.9Z"
              />
              <path
                className={styles.spiderHead}
                d="M20 12.7c-1.8 0-3.1 1.2-3.1 2.8 0 1.4 1.3 2.5 3.1 2.5s3.1-1.1 3.1-2.5c0-1.6-1.3-2.8-3.1-2.8Z"
              />
              <path
                className={styles.spiderMark}
                d="m20 19.2 1.2 2-1.2 2.3-1.2-2.3z"
              />
              <circle className={styles.spiderEye} cx="18.2" cy="14.8" r=".55" />
              <circle className={styles.spiderEye} cx="21.8" cy="14.8" r=".55" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
