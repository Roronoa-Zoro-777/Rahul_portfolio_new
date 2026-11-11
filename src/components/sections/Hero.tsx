"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { HudFrame } from "@/components/ui/HudFrame";
import { useScrollSectionProgress } from "@/hooks/useScrollSectionProgress";
import { FrameSequenceLoader } from "@/lib/frameSequenceLoader";
import {
  ANALYST_INSIGHTS,
  DIALOGUES,
  FRAME_COUNT,
  HERO_TEXT_FADE_END,
  framePath,
} from "@/lib/hero";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const bigLeftTextRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const frameReadoutRef = useRef<HTMLSpanElement | null>(null);

  const frameLoaderRef = useRef<FrameSequenceLoader | null>(null);
  const loadedRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const prevInsightIdRef = useRef("");
  const prevDialogueIdRef = useRef("");

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [activeInsightId, setActiveInsightId] = useState<string | null>(null);
  const [activeDialogueId, setActiveDialogueId] = useState<string | null>(null);
  const activeInsightIndex = ANALYST_INSIGHTS.findIndex(
    (insight) => insight.id === activeInsightId,
  );
  const activeDialogueIndex = DIALOGUES.findIndex(
    (dialogue) => dialogue.id === activeDialogueId,
  );
  const calloutOnRight =
    (activeInsightIndex >= 0 ? activeInsightIndex : activeDialogueIndex) % 2 ===
    1;

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = frameLoaderRef.current?.getNearest(index);
    if (!img?.complete || !img.naturalWidth) return;
    const ctx = canvasContextRef.current ?? canvas.getContext("2d");
    if (!ctx) return;
    canvasContextRef.current = ctx;

    const cw = canvas.width;
    const ch = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let drawW: number;
    let drawH: number;
    if (canvasRatio > imgRatio) {
      drawW = cw;
      drawH = cw / imgRatio;
    } else {
      drawH = ch;
      drawW = ch * imgRatio;
    }

    if (window.innerWidth <= 768) {
      drawW *= 1.3;
      drawH *= 1.3;
    }

    const drawX = (cw - drawW) / 2;
    const drawY = (ch - drawH) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loader = new FrameSequenceLoader(
      FRAME_COUNT,
      (index) => framePath(index + 1),
      (frameIndex, loadedCount) => {
        if (cancelled) return;
        setLoadProgress(Math.min(1, loadedCount / 8));
        if (!loadedRef.current) {
          loadedRef.current = true;
          setLoaded(true);
        }
        if (frameIndex === lastFrameRef.current) drawFrame(frameIndex);
      },
    );
    frameLoaderRef.current = loader;
    loader.request(0);

    return () => {
      cancelled = true;
      loader.dispose();
      if (frameLoaderRef.current === loader) frameLoaderRef.current = null;
    };
  }, [drawFrame]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    canvasContextRef.current = canvas.getContext("2d");
    drawFrame(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
  }, [drawFrame]);

  useEffect(() => {
    resizeCanvas();
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resizeCanvas, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [resizeCanvas]);

  useEffect(() => {
    if (!loaded) return;
    sectionRef.current?.style.setProperty("--frame-tone", "#d4a22f");
    drawFrame(0);
    lastFrameRef.current = 0;
  }, [loaded, drawFrame]);

  const handleScrollProgress = useCallback(
    (progress: number) => {
      const activeInsight =
        ANALYST_INSIGHTS.find(
          (insight) => progress >= insight.show && progress <= insight.hide,
        )?.id ?? "";
      if (activeInsight !== prevInsightIdRef.current) {
        prevInsightIdRef.current = activeInsight;
        setActiveInsightId(activeInsight || null);
      }

      const activeDialogue =
        DIALOGUES.find(
          (dialogue) => progress >= dialogue.show && progress <= dialogue.hide,
        )?.id ?? "";
      if (activeDialogue !== prevDialogueIdRef.current) {
        prevDialogueIdRef.current = activeDialogue;
        setActiveDialogueId(activeDialogue || null);
      }

      if (!loadedRef.current) return;

      const frameIndex = Math.round(progress * (FRAME_COUNT - 1));
      if (frameIndex !== lastFrameRef.current) {
        lastFrameRef.current = frameIndex;
        frameLoaderRef.current?.request(frameIndex);
        drawFrame(frameIndex);
      }

      if (heroTextRef.current) {
        const opacity = Math.max(0, 1 - progress / HERO_TEXT_FADE_END);
        heroTextRef.current.style.opacity = String(opacity);
        heroTextRef.current.style.transform = `translateY(${(1 - opacity) * 12}px)`;
      }

      if (bigLeftTextRef.current) {
        const op =
          progress < 0.1
            ? 0
            : progress < 0.18
              ? (progress - 0.1) / 0.08
              : Math.max(0, 1 - (progress - 0.35) / 0.1);
        bigLeftTextRef.current.style.opacity = String(op);
        bigLeftTextRef.current.style.transform = `translateY(${(1 - op) * 14}px)`;
      }

      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${progress})`;
      }

      const frameNumber = frameIndex + 1;
      if (frameReadoutRef.current) {
        frameReadoutRef.current.textContent = `FRAME ${String(frameNumber).padStart(3, "0")} / ${FRAME_COUNT}`;
      }

    },
    [drawFrame],
  );

  useScrollSectionProgress(sectionRef, handleScrollProgress);

  return (
    <section ref={sectionRef} className="scroll-animation scroll-animation--slow relative">
      <div
        className="hero-viewport sticky top-0 min-h-[100dvh] w-full overflow-hidden bg-background"
        style={{
          height: "100dvh",
          willChange: "transform",
          transform: "translateZ(0)",
          backgroundImage: `url(${framePath(2)})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ willChange: "contents", transform: "translateZ(0)" }}
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,11,0.92) 0%, rgba(10,10,11,0.58) 28%, transparent 62%), radial-gradient(120% 80% at 50% 10%, transparent 30%, rgba(10,10,11,0.35) 70%, rgba(10,10,11,0.78) 100%)",
          }}
        />

        <div className="frame-hud-corner pointer-events-none absolute left-6 top-24 md:left-10 md:top-28" style={{ color: "var(--frame-tone, #d4a22f)" }}>
          <HudFrame corner="tl" size={26} />
        </div>
        <div className="frame-hud-corner pointer-events-none absolute right-6 top-24 md:right-10 md:top-28" style={{ color: "var(--frame-tone, #d4a22f)" }}>
          <HudFrame corner="tr" size={26} />
        </div>
        <div className="frame-hud-corner pointer-events-none absolute bottom-14 left-6 md:bottom-16 md:left-10" style={{ color: "var(--frame-tone, #d4a22f)" }}>
          <HudFrame corner="bl" size={26} />
        </div>
        <div className="frame-hud-corner pointer-events-none absolute bottom-14 right-6 md:bottom-16 md:right-10" style={{ color: "var(--frame-tone, #d4a22f)" }}>
          <HudFrame corner="br" size={26} />
        </div>

        <div className="pointer-events-none absolute left-6 top-20 z-10 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.22em] md:left-10 md:top-24">
          <span className="recording-dot" aria-hidden />
          <span className="text-white/80">REC</span>
          <span ref={frameReadoutRef} className="text-[var(--frame-tone,#d4a22f)]">
            FRAME 001 / {FRAME_COUNT}
          </span>
        </div>

        <div
          ref={heroTextRef}
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-3 px-6 pb-20 sm:gap-5 sm:pb-24 md:px-12 md:pb-28"
          style={{ transition: "opacity 80ms linear" }}
        >
          <EyebrowBadge>DATA ANALYTICS // PROFILE // ONLINE</EyebrowBadge>
          <h1 className="max-w-[14ch] font-sans text-3xl font-bold leading-[0.95] tracking-tighter text-white [text-shadow:0_3px_18px_rgba(0,0,0,0.85)] sm:text-5xl md:text-7xl lg:text-8xl">
            I am
            <br />
            <span className="text-[#f4bd45]">Rahul B</span>
          </h1>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 rounded-lg bg-accent/20 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-accent backdrop-blur-md transition-all hover:bg-accent hover:text-black border border-accent/30 hover:scale-105"
          >
            View Resume
          </a>
        </div>

        <div
          ref={bigLeftTextRef}
          className="pointer-events-none absolute left-6 top-[18%] z-10 flex max-w-[90%] flex-col gap-3 sm:gap-5 md:left-12 md:max-w-[42%]"
          style={{ opacity: 0, transition: "opacity 80ms linear" }}
        >
          <span className="relative -top-2 inline-flex items-center gap-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(212,162,47,0.85)]" />
            Profile &mdash; Data Analytics
          </span>
          <h2 className="font-sans text-[clamp(2rem,7vw,6.5rem)] font-bold leading-[0.88] tracking-tighter text-white [text-shadow:0_3px_18px_rgba(0,0,0,0.85)]">
            Data
            <br />
            <span className="text-[#f4bd45]">Analyst.</span>
          </h2>
        </div>

        <div
          className={`pointer-events-none absolute inset-x-6 bottom-[13%] z-20 flex sm:inset-x-8 md:inset-x-12 md:bottom-[12%] ${
            calloutOnRight ? "justify-end" : "justify-start"
          }`}
          aria-live="off"
        >
          <div
            className={`hero-scroll-callouts w-[min(26rem,88vw)] md:w-[min(24rem,46vw)] transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
              activeInsightId || activeDialogueId
                ? "translate-y-0 opacity-100"
                : "-translate-y-2 opacity-0"
            }`}
          >
            <div className={activeInsightId ? "grid" : "hidden"}>
              {ANALYST_INSIGHTS.map((insight) => {
                const active = insight.id === activeInsightId;
                return (
                  <div
                    key={insight.id}
                    aria-hidden={!active}
                    className={`col-start-1 row-start-1 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
                      active
                        ? "translate-y-0 opacity-100"
                        : "translate-y-1 opacity-0"
                    }`}
                  >
                    <p className="hero-callout-eyebrow mb-1 text-[9px] sm:text-[10px]">
                      Data analyst // field note
                    </p>
                    <h3 className="hero-callout-title text-lg leading-tight sm:text-xl md:text-2xl">
                      {insight.headline}
                    </h3>
                    <p className="hero-callout-caption mt-1 max-w-[38ch] text-xs leading-relaxed sm:text-sm">
                      {insight.description}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className={activeDialogueId ? "mt-3 grid" : "hidden"}>
              {DIALOGUES.map((dialogue) => {
                const active = dialogue.id === activeDialogueId;
                return (
                  <figure
                    key={dialogue.id}
                    aria-hidden={!active}
                    className={`col-start-1 row-start-1 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
                      active
                        ? "translate-y-0 opacity-100"
                        : "translate-y-1 opacity-0"
                    }`}
                  >
                    <blockquote className="hero-callout-quote text-xs leading-relaxed sm:text-sm">
                      &ldquo;{dialogue.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-2 flex items-center gap-3">
                      <span className="hero-callout-meta text-[9px] sm:text-[10px]">
                        {dialogue.speaker}
                      </span>
                      <span className="hero-callout-meta text-[9px] text-accent sm:text-[10px]">
                        {dialogue.film}
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <div className="mx-6 mb-3 h-px bg-white/10 md:mx-10">
            <div
              ref={progressFillRef}
              className="h-full origin-left bg-accent"
              style={{ transform: "scaleX(0)", transition: "transform 80ms linear" }}
            />
          </div>
          <div className="mx-6 flex items-center justify-between pb-4 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-400 md:mx-10">
            <span>SEQ 001 / {FRAME_COUNT}</span>
            <span className="text-[var(--frame-tone,#d4a22f)]">RAHUL // DATA ANALYST</span>
            <span>Scroll &darr;</span>
          </div>
        </div>

        {!loaded && (
            <div className="pointer-events-none absolute bottom-24 right-6 z-30 flex flex-col items-end gap-2 px-6 text-right md:bottom-28 md:right-10">
            <EyebrowBadge>SUIT UP PROTOCOL // BOOTING</EyebrowBadge>
            <div className="h-px w-60 bg-white/10 md:w-80">
              <div
                className="h-full bg-accent transition-[width] duration-150 ease-out"
                style={{ width: `${Math.round(loadProgress * 100)}%` }}
              />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              Loading Mark LXXXV &nbsp;&middot;&nbsp; {Math.round(loadProgress * 100)}%
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
