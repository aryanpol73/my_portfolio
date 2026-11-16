"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { hero, profile } from "@/data/portfolio";
import type { GitHubStats } from "@/lib/github";
import { fadeUp, stagger } from "@/lib/motion";
import { scrollToSection } from "@/lib/scroll";
import { HeroBento } from "./HeroBento";

export function Hero({ stats }: { stats: GitHubStats }) {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 sm:pt-36 md:pb-28">
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12">
        <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="show">
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-muted">
              <span className="relative flex size-2">
                <span className="pulse-ring absolute inset-0 rounded-full bg-accent" />
                <span className="relative size-2 rounded-full bg-accent" />
              </span>
              {profile.availability}
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="display mt-7 text-[2.35rem] text-fg sm:text-5xl lg:text-[3.5rem]">
            {hero.headline}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {hero.subheadline}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-invert-bg px-6 py-3.5 text-sm font-semibold text-invert-fg transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Start a Project
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("work");
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
            >
              Explore Case Studies
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
            </a>
          </motion.div>

          <motion.dl variants={fadeUp} className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            {[
              { k: "4.5K+", v: "users served live" },
              { k: "750+", v: "automated tests in 2 repos" },
              { k: "IST", v: "overlaps EU & US AM" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="sr-only">{s.v}</dt>
                <dd className="font-mono text-lg font-medium text-fg">{s.k}</dd>
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
