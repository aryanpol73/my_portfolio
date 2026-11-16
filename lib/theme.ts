export type Theme = "dark" | "light";

export const THEME_EVENT = "themechange";

type ViewTransitionDocument = {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/**
 * Applies a theme and, where the View Transitions API exists, reveals it as a circle
 * growing from `origin` (usually the centre of the button that was pressed).
 */
export function setTheme(next: Theme, origin?: { x: number; y: number }): void {
  const apply = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage unavailable (private mode): the theme still applies for this visit.
    }
    window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: next }));
  };

  const doc = document as unknown as ViewTransitionDocument;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!origin || reduce || typeof doc.startViewTransition !== "function") {
    apply();
    return;
  }

  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const transition = doc.startViewTransition.call(document, apply);
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
}

export function toggleTheme(origin?: { x: number; y: number }): void {
  setTheme(getTheme() === "light" ? "dark" : "light", origin);
}

/** Centre point of an element, for the reveal origin. */
export function centerOf(el: Element): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
