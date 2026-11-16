"use client";

import { LogoMark } from "./LogoMark";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks, profile } from "@/data/portfolio";
import { spring } from "@/lib/motion";
import { scrollToSection } from "@/lib/scroll";
import { openCommandPalette } from "./CommandPalette";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [isMac, setIsMac] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 32, restDelta: 0.001 });

  useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.userAgent)), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["top", ...navLinks.map((l) => l.href.slice(1)), "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function go(id: string) {
    setOpen(false);
    scrollToSection(id);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-[linear-gradient(90deg,var(--accent),var(--accent-2),var(--accent-3))] shadow-[0_0_10px_var(--accent-glow)]"
      />
      <nav
        aria-label="Primary"
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border pl-3 pr-2 backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled || open ? "border-line bg-[var(--nav)] shadow-lg shadow-black/5" : "border-transparent bg-transparent"
        }`}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            go("top");
          }}
          className="group flex items-center gap-2.5 rounded-lg"
        >
          <LogoMark className="size-8 shrink-0 drop-shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105" />
          <span className="text-sm font-semibold tracking-tight text-fg">{profile.name}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const id = link.href.slice(1);
            const isActive = active === id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(id);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      transition={spring}
                      className="absolute inset-0 rounded-lg bg-surface-2"
                      aria-hidden
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Open command palette"
            title="Search and jump anywhere"
            className="flex h-9 items-center gap-2 rounded-full border border-line px-2.5 text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <Search className="size-4" aria-hidden />
            <kbd className="hidden rounded border border-line-strong px-1 font-mono text-[0.62rem] lg:inline">{isMac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          <ThemeToggle />
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              go("contact");
            }}
            className="hidden items-center gap-1.5 rounded-full bg-invert-bg px-4 py-2 text-sm font-semibold text-invert-fg transition-transform hover:scale-[1.03] active:scale-[0.98] sm:inline-flex"
          >
            Start a Project
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-full border border-line text-fg md:hidden"
          >
            {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={spring}
            className="mx-auto mt-2 max-w-6xl origin-top rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/30 md:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, delay: 0.03 * i }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(link.href.slice(1));
                    }}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-base text-fg hover:bg-surface-2"
                  >
                    {link.label}
                    <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go("contact");
              }}
              className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-invert-bg px-4 py-3 text-sm font-semibold text-invert-fg"
            >
              Start a Project
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
