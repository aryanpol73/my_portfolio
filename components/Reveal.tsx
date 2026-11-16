"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, viewport } from "@/lib/motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "ul" | "li";
}

/** Staggered viewport reveal container. Direct children using <RevealItem> animate in sequence. */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={stagger(0.07, delay)} initial="hidden" whileInView="show" viewport={viewport}>
      {children}
    </Comp>
  );
}

export function RevealItem({ children, className, as = "div" }: Omit<RevealProps, "delay">) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={fadeUp}>
      {children}
    </Comp>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <Reveal className="mb-12 max-w-2xl md:mb-16">
      <RevealItem>
        <p className="eyebrow mb-4 flex items-center gap-2">
          <span className="h-px w-6 bg-line-strong" aria-hidden />
          {eyebrow}
        </p>
      </RevealItem>
      <RevealItem>
        <h2 className="display text-3xl text-fg sm:text-4xl md:text-[2.75rem]">{title}</h2>
      </RevealItem>
      {lede && (
        <RevealItem>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{lede}</p>
        </RevealItem>
      )}
    </Reveal>
  );
}
