"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

/** Pulls its child a few pixels toward a mouse cursor. Touch and reduced motion get a static element. */
export function Magnetic({ children, strength = 0.28, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });

  function onMove(e: PointerEvent<HTMLSpanElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength * 1.3);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} className={`inline-flex ${className}`}>
      {children}
    </motion.span>
  );
}
