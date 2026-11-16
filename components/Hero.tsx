"use client";

import { animate, motion, type Variants } from "framer-motion";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { hero, profile } from "@/data/portfolio";
import type { GitHubStats } from "@/lib/github";
import { fadeUp, spring, stagger } from "@/lib/motion";
import { scrollToSection } from "@/lib/scroll";
import { HeroBento } from "./HeroBento";
import { Magnetic } from "./Magnetic";

type Phase = "init" | "typing" | "done";

const BOOT_KEY = "hero-booted";
const ease = [0.22, 1, 0.36, 1] as const;

const word: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease } },
};

/** Index range [start, end) of `phrase` inside the space-split `words`, or null. */
function phraseRange(words: string[], phrase: string): [number, number] | null {
  const target = phrase.split(" ");
  for (let i = 0; i + target.length <= words.length; i++) {
    if (target.every((t, j) => words[i + j]?.replace(/[,.]$/, "") === t)) return [i, i + target.length];
  }
  return null;
}

export function Hero({ stats }: { stats: GitHubStats }) {
  const [phase, setPhase] = useState<Phase>("init");
  const glowRef = useRef<HTMLDivElement>(null);
  const words = hero.headline.split(" ");
  const range = phraseRange(words, hero.highlight);

  // The boot line plays once per browser session and never for reduced motion.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(BOOT_KEY) === "1";
      sessionStorage.setItem(BOOT_KEY, "1");
    } catch {
      // Storage blocked: just play it.
    }
    setPhase(reduce || seen ? "done" : "typing");
  }, []);

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const el = glowRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  const shown = phase === "done" ? "show" : "hidden";

  return (
    <section id="top" onPointerMove={onPointerMove} className="group/hero relative overflow-hidden pt-28 pb-20 sm:pt-36 md:pb-28">
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        ref={glowRef}
        aria-hidden
        className="dot-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/hero:opacity-80"
      />
      <div aria-hidden className="hero-glow pointer-events-none absolute left-1/2 top-[-30%] h-[80%] w-[130%] -translate-x-1/2" />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12">
        <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate={shown}>
          <div className="flex h-8 items-center">
            {phase === "typing" ? (
              <BootLine text={hero.bootLine} onDone={() => setPhase("done")} />
            ) : (
              <motion.span
                variants={{
                  hidden: { opacity: 0, scale: 0.85, filter: "blur(4px)" },
                  show: { opacity: 1, scale: 1, filter: "blur(0px)", transition: spring },
                }}
                className="inline-flex origin-left items-center gap-2.5 rounded-full border border-line bg-surface-glass px-3.5 py-1.5 text-xs font-medium text-muted backdrop-blur"
              >
                <span className="relative flex size-2">
                  <span className="pulse-ring absolute inset-0 rounded-full bg-accent" />
                  <span className="relative size-2 rounded-full bg-accent" />
                </span>
                {profile.availability}
              </motion.span>
            )}
          </div>

          <motion.h1 variants={stagger(0.045)} className="display mt-7 text-[2.35rem] text-fg sm:text-5xl lg:text-[3.5rem]">
            {words.map((w, i) => {
              const hl = range !== null && i >= range[0] && i < range[1];
              return (
                <span key={i}>
                  <motion.span variants={word} className={`inline-block ${hl ? "grad-text" : ""}`}>
                    {w}
                  </motion.span>
                  {i < words.length - 1 ? " " : null}
                </span>
              );
            })}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {hero.subheadline}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Magnetic className="w-full sm:w-auto">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
                className="btn-glow group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Start a Project
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </a>
            </Magnetic>
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("work");
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-surface-glass px-6 py-3.5 text-sm font-semibold text-fg backdrop-blur transition-colors hover:bg-surface-2"
            >
              Explore Case Studies
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
            </a>
          </motion.div>

          <motion.dl variants={fadeUp} className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            {hero.stats.map((s, i) => (
              <div key={s.v}>
                <dt className="sr-only">{s.v}</dt>
                <dd className="flex items-center gap-1.5 font-mono text-lg font-medium text-fg">
                  <CountUp value={s.k} start={phase === "done"} delay={0.45 + i * 0.12} />
                  <Verified source={s.source} show={phase === "done"} delay={1.6 + i * 0.14} />
                </dd>
                <dd className="mt-1 text-xs leading-snug text-subtle">{s.v}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <HeroBento stats={stats} />
      </div>
    </section>
  );
}

/** Types `text` like a terminal, holds briefly, then calls onDone. */
function BootLine({ text, onDone }: { text: string; onDone: () => void }) {
  const [count, setCount] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (count < text.length) {
      const t = window.setTimeout(() => setCount((c) => c + 1), count === 0 ? 150 : 22);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => done.current(), 420);
    return () => window.clearTimeout(t);
  }, [count, text.length]);

  return (
    <span className="whitespace-nowrap font-mono text-[0.7rem] text-muted sm:text-[0.8rem]" aria-hidden>
      <span className="text-accent">❯ </span>
      {text.slice(0, count)}
      <span className="caret" />
    </span>
  );
}

/** Counts the numeric part of a value like "4.5K+" or "880+" up from zero. Non-numeric values render as is. */
function CountUp({ value, start, delay }: { value: string; start: boolean; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || !start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, prefix = "", num = "0", suffix = ""] = match;
    const target = parseFloat(num);
    const decimals = num.includes(".") ? num.split(".")[1]!.length : 0;
    el.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;
    const controls = animate(0, target, {
      duration: 1.2,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, value, delay]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}

/** A small ✓ that pops in after the count and names where the number comes from. */
function Verified({ source, show, delay }: { source: string; show: boolean; delay: number }) {
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: show ? 1 : 0 }}
      transition={{ ...spring, delay: show ? delay : 0 }}
      className="group/tip relative inline-grid"
    >
      <button
        type="button"
        aria-label={`Source: ${source}`}
        className="grid size-4 cursor-help place-items-center rounded-full bg-accent-soft text-accent"
      >
        <Check className="size-2.5" strokeWidth={3.5} aria-hidden />
      </button>
      <span
        role="tooltip"
        className="tip pointer-events-none absolute bottom-[calc(100%+8px)] left-0 z-10 hidden w-max max-w-[min(15rem,70vw)] rounded-md bg-invert-bg px-2 py-1.5 font-mono text-[0.62rem] leading-snug text-invert-fg shadow-lg group-focus-within/tip:block group-hover/tip:block"
      >
        {source}
      </span>
    </motion.span>
  );
}
