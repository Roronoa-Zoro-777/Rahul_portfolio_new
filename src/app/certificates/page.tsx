"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  CERTIFICATE_FRAME_COUNT,
  CERTIFICATE_SCROLL_VH,
  certificateFramePath,
} from "@/lib/certificates";
import { FrameSequenceLoader } from "@/lib/frameSequenceLoader";
import { Navbar } from "@/components/ui/Navbar";

const certificates = [
  { title: "Google Data Analytics Capstone", issuer: "Google", file: "/certificates/Google Data Analytics Capstone.pdf" },
  { title: "Data Everywhere", issuer: "Google", file: "/certificates/Data everywhere.pdf" },
  { title: "Ask Questions", issuer: "Google", file: "/certificates/ask questions.pdf" },
  { title: "Prepare Data for Exploration", issuer: "Google", file: "/certificates/prepare data for exploration.pdf" },
  { title: "Deloitte Data Analytics", issuer: "Deloitte", file: "/certificates/delloite.pdf" },
  { title: "IBM Data Analytics", issuer: "IBM", file: "/certificates/ibm.pdf" },
  { title: "Quantium Data Analytics", issuer: "Quantium", file: "/certificates/quatium data analytics.pdf" },
  { title: "SuprMentr Full Stack", issuer: "SuprMentr", file: "/certificates/suprmentr full stack.pdf" },
];

// split into 4 rows of 2 items each
const rows: typeof certificates[] = [];
for (let i = 0; i < certificates.length; i += 2) rows.push(certificates.slice(i, i + 2));

export default function CertificatesPage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const frameReadoutRef = useRef<HTMLSpanElement | null>(null);

  const frameLoaderRef = useRef<FrameSequenceLoader | null>(null);
  const requestedFrameRef = useRef(-1);
  const tickingRef = useRef(false);
  const loadedRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const frameAnimationRef = useRef<number | null>(null);

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // smooth scroll progress for the whole section – used for the overlay grid
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  // ---------- Draw a frame ----------
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (idx !== requestedFrameRef.current) {
      requestedFrameRef.current = idx;
      frameLoaderRef.current?.request(idx);
    }
    const img = frameLoaderRef.current?.getNearest(idx);
    if (!img?.complete || !img.naturalWidth) return;
    const ctx = canvasContextRef.current ?? canvas.getContext("2d");
    if (!ctx) return;
    canvasContextRef.current = ctx;
    const cw = canvas.width, ch = canvas.height;
    const imgR = img.naturalWidth / img.naturalHeight;
    const canR = cw / ch;
    let dw: number, dh: number;
    if (canR > imgR) { dw = cw; dh = cw / imgR; } else { dh = ch; dw = ch * imgR; }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }, []);

  // ---------- Load frames ----------
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    let cancelled = false;
    const loader = new FrameSequenceLoader(
      CERTIFICATE_FRAME_COUNT,
      (index) => certificateFramePath(index + 1),
      (frameIndex, loadedCount) => {
        if (cancelled) return;
        setLoadProgress(Math.min(1, loadedCount / 8));
        if (!loadedRef.current) {
          loadedRef.current = true;
          setLoaded(true);
        }
        if (frameIndex === requestedFrameRef.current) drawFrame(frameIndex);
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

  // ---------- Resize canvas ----------
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    drawFrame(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
  }, [drawFrame]);

  useEffect(() => { resizeCanvas(); window.addEventListener("resize", resizeCanvas); return () => window.removeEventListener("resize", resizeCanvas); }, [resizeCanvas]);

  useEffect(() => {
    if (!loaded) return;
    drawFrame(0);
    lastFrameRef.current = 0;
  }, [loaded, drawFrame]);

  // ---------- Scroll‑driven playback ----------
  useEffect(() => {
    const animate = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      const speed = Math.abs(diff) > 80 ? 0.45 : 0.28;
      currentFrameRef.current += diff * speed;
      const i = Math.round(currentFrameRef.current);
      if (i !== lastFrameRef.current) { lastFrameRef.current = i; drawFrame(i); }
      if (Math.abs(diff) > 0.05) frameAnimationRef.current = requestAnimationFrame(animate);
      else { currentFrameRef.current = targetFrameRef.current; frameAnimationRef.current = null; }
    };
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        tickingRef.current = false;
        const sec = sectionRef.current;
        if (!sec || !loadedRef.current) return;
        const rect = sec.getBoundingClientRect();
        const scrollable = sec.offsetHeight - window.innerHeight;
        const prog = scrollable <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / scrollable));
        targetFrameRef.current = Math.max(0, Math.min(CERTIFICATE_FRAME_COUNT - 1, prog * (CERTIFICATE_FRAME_COUNT - 1)));
        if (frameAnimationRef.current === null) frameAnimationRef.current = requestAnimationFrame(animate);
        if (progressFillRef.current) progressFillRef.current.style.transform = `scaleX(${prog})`;
        if (frameReadoutRef.current) {
          const fNum = Math.max(1, Math.round(prog * (CERTIFICATE_FRAME_COUNT - 1))) + 1;
          frameReadoutRef.current.textContent = `FRAME ${String(fNum).padStart(3, "0")} / ${CERTIFICATE_FRAME_COUNT}`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); if (frameAnimationRef.current) cancelAnimationFrame(frameAnimationRef.current); };
  }, [drawFrame]);

  // ---------- Modal state for full view ----------
  const [modalFile, setModalFile] = useState<string | null>(null);
  const closeModalRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!modalFile) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeModalRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalFile(null);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [modalFile]);

  return (
    <>
      <Navbar />
      <main id="main-content" ref={sectionRef} className="relative bg-black" style={{ height: `${CERTIFICATE_SCROLL_VH}vh` }}>
        <h1 className="sr-only">Certificates</h1>
        {/* ---- Frame canvas ---- */}
        <div className="sticky top-0 h-screen overflow-hidden" style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backgroundImage: loaded ? undefined : `url(${certificateFramePath(1)})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}>
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ willChange: "contents", transform: "translateZ(0)" }} />
          <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
          {/* ---- overlay stack of cards ---- */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {certificates.map((cert, idx) => {
              const slot = 0.82 / certificates.length;
              const bandStart = 0.08 + idx * slot;
              const bandPeak = bandStart + 0.015;
              const bandFadeEnd = bandStart + slot - 0.015;
              const bandGone = bandStart + slot;
              return (
                <CertCard
                  key={cert.file}
                  cert={cert}
                  scrollYProgress={scrollYProgress}
                  bandStart={bandStart}
                  bandPeak={bandPeak}
                  bandFadeEnd={bandFadeEnd}
                  bandGone={bandGone}
                  onOpen={() => setModalFile(cert.file)}
                />
              );
            })}
          </div>
          {/* ---- HUD bar ---- */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
            <div className="mx-6 mb-3 h-px bg-white/10 md:mx-10">
              <div ref={progressFillRef} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)", transition: "transform 80ms linear" }} />
            </div>
            <div className="mx-6 flex items-center justify-between pb-4 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-400 md:mx-10">
              <span ref={frameReadoutRef}>FRAME 001 / {CERTIFICATE_FRAME_COUNT}</span>
              <span className="text-[var(--frame-tone,#d4a22f)]">Certificates</span>
              <span>Scroll &darr;</span>
            </div>
          </div>
          {/* loading indicator */}
          {!loaded && (
            <div className="pointer-events-none absolute bottom-24 right-6 z-30 flex flex-col items-end gap-2 px-6 text-right md:bottom-28 md:right-10">
              <div className="h-px w-60 bg-white/10 md:w-80">
                <div className="h-full bg-accent transition-[width] duration-150 ease-out" style={{ width: `${Math.round(loadProgress * 100)}%` }} />
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">Loading sequence &nbsp;&middot;&nbsp; {Math.round(loadProgress * 100)}%</p>
            </div>
          )}
        </div>
      </main>

      {/* ---- Full‑screen modal for PDF view ---- */}
      {modalFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-dialog-title"
        >
          <h2 id="certificate-dialog-title" className="sr-only">
            Certificate document
          </h2>
          <button
            ref={closeModalRef}
            type="button"
            aria-label="Close certificate document"
            onClick={() => setModalFile(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            ✕
          </button>
          <iframe
            title="Certificate document viewer"
            src={encodeURI(modalFile)}
            className="h-full max-h-[90vh] w-full max-w-5xl rounded-lg bg-white"
            style={{ border: "none" }}
          />
        </div>
      )}


      {/* ---- water‑glass styles ---- */}
      <style jsx global>{`
        .water-glass {
          position: relative;
          background: rgba(10, 10, 12, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(255, 255, 255, 0.03), 0 24px 60px -20px rgba(0, 0, 0, 0.8);
          transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .water-glass::before { content:""; position:absolute; inset:0; pointer-events:none; z-index:1; border-radius:inherit; background:linear-gradient(125deg,rgba(255,255,255,0.08)0%,transparent 28%,transparent 72%,rgba(255,255,255,0.04)100%); }
        .water-glass:hover { border-color:rgba(255, 255, 255, 0.3); background:rgba(10, 10, 12, 0.85); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(255, 255, 255, 0.04), 0 30px 70px -20px rgba(0, 0, 0, 0.9); transform:translateY(-2px) scale(1.01); }
      `}</style>
    </>
  );
}

/* ---------- Individual card ---------- */
function CertCard({
  cert,
  scrollYProgress,
  bandStart,
  bandPeak,
  bandFadeEnd,
  bandGone,
  onOpen,
}: {
  cert: { title: string; issuer: string; file: string };
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  bandStart: number;
  bandPeak: number;
  bandFadeEnd: number;
  bandGone: number;
  onOpen: () => void;
}) {
  const opacity = useTransform(scrollYProgress, [bandStart, bandPeak, bandFadeEnd, bandGone], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [bandStart, bandPeak, bandFadeEnd, bandGone], [0.85, 1, 1, 0.95]);
  const y = useTransform(scrollYProgress, [bandStart, bandPeak, bandFadeEnd, bandGone], [30, 0, 0, -30]);
  const zIndex = useTransform(opacity, (val) => Math.round(val * 100));

  // Animate button colors based on how visible the certificate is
  const buttonBorder = useTransform(opacity, [0.8, 1], ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.5)"]);
  const buttonBg = useTransform(opacity, [0.8, 1], ["rgba(255,255,255,0)", "rgba(255,255,255,0.1)"]);
  const buttonText = useTransform(opacity, [0.8, 1], ["rgba(255,255,255,0.4)", "#ffffff"]);

  return (
    <motion.div style={{ zIndex }} className="absolute left-1/2 top-[65%] md:top-[70%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
      <motion.div
        style={{ opacity, scale, y }}
        className="water-glass w-[85vw] max-w-[22rem] md:w-[22rem] h-auto py-6 md:py-8 flex flex-col justify-center items-center px-4 md:px-8 gap-4 md:gap-5 overflow-hidden rounded-[2.5rem] md:rounded-[3rem]"
      >
        {/* Certificate name */}
        <h3 className="text-center text-sm md:text-base font-bold leading-snug text-white tracking-wide">
          {cert.title}
        </h3>
        <motion.button
          onClick={onOpen}
          style={{ borderColor: buttonBorder, backgroundColor: buttonBg, color: buttonText }}
          className="group flex items-center gap-2 rounded-full border px-5 py-2.5 md:px-6 md:py-3 font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm transition-transform hover:scale-105 shrink-0"
        >
          <span style={{ color: "inherit" }}>View Full</span>
          <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
