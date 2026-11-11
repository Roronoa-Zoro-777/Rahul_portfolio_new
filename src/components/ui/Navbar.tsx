"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/certificates", label: "Certificates" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="nav-shell pointer-events-none fixed inset-x-0 top-0 z-40">
      <a
        href="#main-content"
        className="pointer-events-auto fixed left-4 top-4 z-[60] -translate-y-20 rounded-lg bg-accent px-4 py-2 font-mono text-sm font-bold text-black focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="nav-shell-content relative flex items-start justify-start p-4">
        {/* Hamburger Menu (Left) */}
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className={`nav-liquid-glass pointer-events-auto group relative z-50 flex h-14 w-14 flex-col items-center justify-center gap-[5px] rounded-full text-white transition-all duration-500 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:h-16 md:w-16 ${
            menuOpen ? "scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)]" : ""
          }`}
        >
          {/* Outer rotating ring on hover */}
          <span className="absolute inset-0 rounded-full border border-white/20 transition-all duration-700 group-hover:rotate-180 group-hover:scale-110 group-hover:border-accent/40" />
          
          {/* Top Line */}
          <span
            className={`h-[2px] rounded-full bg-white transition-all duration-400 ease-out ${
              menuOpen
                ? "w-7 translate-y-[7px] rotate-45 bg-accent md:w-8"
                : "w-6 group-hover:-translate-y-0.5 group-hover:w-8 md:w-7"
            }`}
          />
          {/* Middle Line */}
          <span
            className={`h-[2px] rounded-full bg-white transition-all duration-300 ease-out ${
              menuOpen ? "w-0 opacity-0" : "w-8 group-hover:w-6 md:w-9"
            }`}
          />
          {/* Bottom Line */}
          <span
            className={`h-[2px] rounded-full bg-white transition-all duration-400 ease-out ${
              menuOpen
                ? "w-7 -translate-y-[7px] -rotate-45 bg-accent md:w-8"
                : "w-5 group-hover:translate-y-0.5 group-hover:w-7 md:w-6"
            }`}
          />
        </button>

        {menuOpen && (
          <nav
            id="primary-navigation"
            aria-label="Primary navigation"
            className="pointer-events-auto fixed inset-y-0 left-0 z-40 flex h-dvh w-[min(20rem,85vw)] flex-col gap-2 overflow-y-auto border-r border-white/15 bg-black/90 px-5 pb-6 pt-24 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            {navigationLinks.map(({ href, label }) => {
              const isActive =
                pathname === href ||
                (href !== "/" && pathname.startsWith(`${href}/`));

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.24em] transition-colors hover:bg-white/[0.1] hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive ? "text-accent" : "text-white/90"
                  }`}
                >
                  {label}
                  {label === "Contact" && (
                    <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
