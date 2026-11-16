"use client";

import { motion } from "framer-motion";
import type { ProjectVisualKind } from "@/data/portfolio";

/**
 * Lightweight, theme-aware architecture illustrations for each case study.
 * Pure SVG/CSS so they stay crisp at any size and cost nothing to load.
 */
export function ProjectVisual({ kind, className = "" }: { kind: ProjectVisualKind; className?: string }) {
  return (
    <div
      className={`dot-grid relative overflow-hidden rounded-xl border border-line bg-surface-2/60 ${className}`}
      aria-hidden
    >
      {kind === "scoreboard" && <Scoreboard />}
      {kind === "branches" && <Branches />}
      {kind === "orbit" && <Orbit />}
      {kind === "graph" && <Graph />}
    </div>
  );
}

function Scoreboard() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-5">
      <div className="w-full max-w-[260px] rounded-xl border border-line bg-surface p-3.5 shadow-xl shadow-black/10">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-wider text-accent">
            <span className="relative flex size-1.5">
              <span className="pulse-ring absolute inset-0 rounded-full bg-accent" />
              <span className="relative size-1.5 rounded-full bg-accent" />
            </span>
            Live · Match 27
          </span>
          <span className="font-mono text-[0.6rem] text-subtle">17.2 ov</span>
        </div>
        {[
          { team: "Home XI", score: "148/4", active: true },
          { team: "Away XI", score: "152", active: false },
        ].map((row) => (
          <div key={row.team} className="flex items-center justify-between py-1">
            <span className={`text-xs ${row.active ? "font-semibold text-fg" : "text-muted"}`}>{row.team}</span>
            <span className={`font-mono text-xs ${row.active ? "text-fg" : "text-subtle"}`}>
              {row.active ? row.score : `target ${row.score}`}
            </span>
          </div>
        ))}
        <div className="mt-3">
          <div className="mb-1 flex justify-between font-mono text-[0.55rem] text-subtle">
            <span>AI win prob.</span>
            <span>62 · 38</span>
          </div>
          <div className="flex h-1.5 overflow-hidden rounded-full bg-surface-2">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: "50%" }}
              whileInView={{ width: "62%" }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.3 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Branches() {
  return (
    <svg viewBox="0 0 320 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
      <line x1="90" y1="18" x2="90" y2="182" stroke="var(--line-strong)" strokeWidth="2" />
      {[34, 64, 128, 166].map((y) => (
        <g key={y}>
          <circle cx="90" cy={y} r="4" fill="var(--muted)" />
          <rect x="102" y={y - 6} width={y === 128 ? 0 : 54} height="12" rx="6" fill="var(--line-strong)" />
        </g>
      ))}
      <motion.path
        d="M90 64 C 90 84, 190 74, 190 96 L 190 112 C 190 128, 96 120, 92 128"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="1 0"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <circle cx="190" cy="96" r="4" fill="var(--accent)" />
      <circle cx="190" cy="112" r="4" fill="var(--accent)" />
      <rect x="202" y="84" width="74" height="40" rx="8" fill="var(--surface)" stroke="var(--line-strong)" />
      <rect x="210" y="93" width="40" height="5" rx="2.5" fill="var(--accent)" opacity="0.8" />
      <rect x="210" y="104" width="56" height="5" rx="2.5" fill="var(--line-strong)" />
      <rect x="210" y="113" width="32" height="5" rx="2.5" fill="var(--line-strong)" />
      <rect x="102" y="120" width="122" height="16" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" strokeOpacity="0.5" />
      <text x="112" y="131.5" fontFamily="var(--font-mono)" fontSize="8" fill="var(--accent)">
        merged · 1 resolution
      </text>
    </svg>
  );
}

function Orbit() {
  return (
    <svg viewBox="0 0 320 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="earth" cx="40%" cy="35%">
          <stop offset="0%" stopColor="var(--muted)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--surface)" stopOpacity="1" />
        </radialGradient>
      </defs>
      {[
        { rx: 120, ry: 34, rot: -18, dur: "16s" },
        { rx: 104, ry: 52, rot: 24, dur: "22s" },
        { rx: 136, ry: 22, rot: 6, dur: "28s" },
      ].map((o, i) => (
        <g key={i} transform={`rotate(${o.rot} 160 100)`}>
          <ellipse cx="160" cy="100" rx={o.rx} ry={o.ry} fill="none" stroke="var(--line-strong)" strokeDasharray="2 4" />
          <circle r="2.6" fill={i === 0 ? "var(--accent)" : "var(--muted)"}>
            <animateMotion
              dur={o.dur}
              repeatCount="indefinite"
              path={`M ${160 - o.rx} 100 a ${o.rx} ${o.ry} 0 1 0 ${o.rx * 2} 0 a ${o.rx} ${o.ry} 0 1 0 ${-o.rx * 2} 0`}
            />
          </circle>
        </g>
      ))}
      <circle cx="160" cy="100" r="40" fill="url(#earth)" stroke="var(--line-strong)" />
      <g transform="translate(236 46)">
        <circle r="9" fill="none" stroke="var(--accent)" strokeOpacity="0.6" />
        <circle r="2" fill="var(--accent)" />
      </g>
      <text x="250" y="40" fontFamily="var(--font-mono)" fontSize="8" fill="var(--muted)">
        TCA · 1.8 km
      </text>
    </svg>
  );
}

const graphNodes: { x: number; y: number; hot?: boolean }[] = [
  { x: 52, y: 52 },
  { x: 84, y: 140 },
  { x: 40, y: 112 },
  { x: 120, y: 90 },
  { x: 268, y: 46 },
  { x: 282, y: 140 },
  { x: 176, y: 70, hot: true },
  { x: 214, y: 92, hot: true },
  { x: 190, y: 128, hot: true },
  { x: 232, y: 132, hot: true },
  { x: 160, y: 108, hot: true },
];

const graphEdges: [number, number][] = [
  [0, 3],
  [1, 2],
  [2, 3],
  [4, 5],
  [6, 7],
  [7, 8],
  [8, 9],
  [6, 10],
  [10, 8],
  [7, 9],
  [6, 8],
];

function Graph() {
  return (
    <svg viewBox="0 0 320 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
      <rect x="146" y="56" width="104" height="90" rx="14" fill="var(--accent-soft)" stroke="var(--accent)" strokeOpacity="0.35" strokeDasharray="3 4" />
      {graphEdges.map(([a, b], i) => {
        const na = graphNodes[a];
        const nb = graphNodes[b];
        if (!na || !nb) return null;
        const hot = Boolean(na.hot && nb.hot);
        return (
          <motion.line
            key={i}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke={hot ? "var(--accent)" : "var(--line-strong)"}
            strokeWidth={hot ? 1.6 : 1}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.05 * i }}
          />
        );
      })}
      {graphNodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.hot ? 5 : 4} fill={n.hot ? "var(--accent)" : "var(--muted)"} />
      ))}
      <text x="150" y="168" fontFamily="var(--font-mono)" fontSize="8" fill="var(--accent)">
        campaign · p97 burst rate
      </text>
    </svg>
  );
}
