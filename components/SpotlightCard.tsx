"use client";

import { forwardRef, type HTMLAttributes, type PointerEvent } from "react";

/** A surface card with a cursor-tracking radial spotlight (pure CSS variables, no re-renders). */
export const SpotlightCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function SpotlightCard(
  { className = "", onPointerMove, children, ...rest },
  ref,
) {
  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
    onPointerMove?.(e);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      className={`spotlight-card rounded-2xl border border-line bg-surface ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
});
