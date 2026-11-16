import type { Transition, Variants } from "framer-motion";

export const spring: Transition = { type: "spring", stiffness: 280, damping: 28 };
export const softSpring: Transition = { type: "spring", stiffness: 180, damping: 26 };

export const viewport = { once: true, margin: "-60px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export const stagger = (step = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});
