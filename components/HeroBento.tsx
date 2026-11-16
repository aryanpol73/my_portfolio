"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Boxes, Brain, Database, Globe2, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { profile, projects as allProjects } from "@/data/portfolio";
import type { GitHubStats } from "@/lib/github";
import { spring } from "@/lib/motion";
import { GitHubIcon } from "./BrandIcons";
import { useCaseStudy } from "./Providers";
import { ProjectShot } from "./ProjectShot";
import { SpotlightCard } from "./SpotlightCard";

const projects = allProjects.filter((p) => p.featured);

const domains = [
  { icon: Globe2, label: "Real-time web & PWAs" },
  { icon: Brain, label: "LLMs & agent workflows" },
  { icon: Database, label: "Data pipelines & ML" },
  { icon: Boxes, label: "CI, testing & DevOps" },
];

function relativeDays(iso: string | null): string {
  if (!iso) return "this week";
  const days = Math.floor((Date.now() - Date.parse(iso)) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} mo ago`;
}

export function HeroBento({ stats }: { stats: GitHubStats }) {
  const [index, setIndex] = useState(0);
  const [lastPush, setLastPush] = useState("recently");
  const { openCaseStudy } = useCaseStudy();
  const project = projects[index] ?? projects[0];

  useEffect(() => setLastPush(relativeDays(stats.lastPush)), [stats.lastPush]);

  if (!project) return null;

  const tiles = [
    { value: String(stats.publicRepos), label: "public repos" },
    { value: String(stats.activeRepos90d), label: "active in 90 days" },
    { value: String(stats.liveDeployments), label: "live deployments" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...spring, delay: 0.25 }}
      className="grid min-w-0 grid-cols-2 gap-3"
    >
      {/* GitHub header */}
      <SpotlightCard className="col-span-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-fg hover:text-accent"
          >
            <GitHubIcon className="size-4 shrink-0" />
            <span className="truncate">github.com/{profile.githubUser}</span>
          </a>
          <span className="tag shrink-0">
            <span className={`size-1.5 rounded-full ${stats.live ? "bg-accent" : "bg-subtle"}`} />
            {stats.live ? `pushed ${lastPush}` : "snapshot"}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-xl border border-line bg-surface-2/60 px-3 py-2.5">
              <div className="font-mono text-xl font-medium text-fg">{t.value}</div>
              <div className="mt-0.5 text-[0.7rem] leading-tight text-subtle">{t.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex h-1.5 overflow-hidden rounded-full bg-surface-2">
            {stats.topLanguages.map((l, i) => (
              <motion.span
                key={l.name}
                className="h-full"
                style={{ background: "var(--fg)", opacity: 1 - i * 0.22 }}
                initial={{ width: 0 }}
                animate={{ width: `${l.share * 100}%` }}
                transition={{ ...spring, delay: 0.5 + i * 0.08 }}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {stats.topLanguages.map((l, i) => (
              <span key={l.name} className="flex items-center gap-1.5 font-mono text-[0.65rem] text-subtle">
                <span className="size-1.5 rounded-full" style={{ background: "var(--fg)", opacity: 1 - i * 0.22 }} />
                {l.name} {Math.round(l.share * 100)}%
              </span>
            ))}
          </div>
        </div>
      </SpotlightCard>

      {/* Flagship preview switcher */}
      <SpotlightCard className="col-span-2 p-4 sm:col-span-2">
        <div role="tablist" aria-label="Flagship builds" className="flex gap-1 overflow-x-auto rounded-xl bg-surface-2/70 p-1">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              role="tab"
              type="button"
              aria-selected={i === index}
              onClick={() => setIndex(i)}
              className={`relative flex-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                i === index ? "text-fg" : "text-subtle hover:text-muted"
              }`}
            >
              {i === index && (
                <motion.span
                  layoutId="hero-tab"
                  transition={spring}
                  className="absolute inset-0 rounded-lg border border-line bg-surface shadow-sm"
                />
              )}
              <span className="relative">{p.name}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="mt-3"
          >
            <ProjectShot project={project} priority sizes="(min-width: 1024px) 520px, 100vw" />
            <div className="mt-3 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-subtle">{project.category}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{project.tagline}</p>
              </div>
              <button
                type="button"
                onClick={() => openCaseStudy(project.slug)}
                className="group flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-fg transition-colors hover:bg-surface-2"
              >
                Case study
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </SpotlightCard>

      {/* Core domains */}
      <SpotlightCard className="p-4">
        <p className="eyebrow mb-3">Core domains</p>
        <ul className="space-y-2">
          {domains.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-xs text-muted">
              <Icon className="size-3.5 shrink-0 text-fg" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </SpotlightCard>

      {/* Shipping velocity */}
      <SpotlightCard className="flex flex-col justify-between p-4">
        <p className="eyebrow flex items-center gap-1.5">
          <Rocket className="size-3.5" aria-hidden /> Velocity
        </p>
        <div>
          <p className="font-mono text-2xl font-medium text-fg">{allProjects.length}</p>
          <p className="text-xs leading-snug text-muted">systems shipped in 2026, all public and documented</p>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
