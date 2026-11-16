"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { spring } from "@/lib/motion";
import { THEME_EVENT, centerOf, getTheme, toggleTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    setThemeState(getTheme());
    // The command palette can also switch the theme; stay in sync with it.
    const onChange = (e: Event) => setThemeState((e as CustomEvent<Theme>).detail);
    window.addEventListener(THEME_EVENT, onChange);
    return () => window.removeEventListener(THEME_EVENT, onChange);
  }, []);

  const label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      type="button"
      onClick={(e) => toggleTheme(centerOf(e.currentTarget))}
      aria-label={label}
      title={label}
      className="relative grid size-9 place-items-center overflow-hidden rounded-full border border-line text-muted transition-colors hover:bg-surface-2 hover:text-fg"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme ?? "pending"}
          initial={{ y: -14, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 14, opacity: 0, rotate: 40 }}
          transition={spring}
          className="grid place-items-center"
        >
          {theme === "light" ? <Moon className="size-4" aria-hidden /> : <Sun className="size-4" aria-hidden />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
