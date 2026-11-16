"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useMemo, useState } from "react";
import { projectGroups, projects, type Project, type ProjectGroup } from "@/data/portfolio";
import { projectsUsing } from "@/lib/capabilities";
import { spring } from "@/lib/motion";
import { CaseStudyDrawer } from "./CaseStudyDrawer";
import { ProjectShot } from "./ProjectShot";
import { useCaseStudy, useTechFilter } from "./Providers";
import { SectionHeader } from "./Reveal";
import { SpotlightCard } from "./SpotlightCard";

type Filter = ProjectGroup | "all";

const lgSpanClass: Record<number, string> = { 1: "lg:col-span-1", 2: "lg:col-span-2", 3: "lg:col-span-3" };

/**
 * Column spans for the 3-column desktop grid, chosen so no row is left half-empty.
 * In the "All" view the four featured projects form a 2-1 / 1-2 bento block first.
 */
function desktopSpans(list: Project[], featureFirst: boolean): number[] {
  const spans: number[] = [];
  let start = 0;
  if (featureFirst) {
    const featuredCount = list.findIndex((p) => !p.featured);
    if (featuredCount === 4) {
      spans.push(2, 1, 1, 2);
      start = 4;
    }
  }
  const rest = list.length - start;
  for (let i = 0; i < rest; i++) spans.push(1);
  const remainder = rest % 3;
  if (remainder === 1) spans[list.length - 1] = 3;
  if (remainder === 2) spans[list.length - 1] = 2;
  return spans;
}

export function Work() {
  const { openCaseStudy } = useCaseStudy();
  const { tech, setTech } = useTechFilter();
  const [groupFilter, setFilter] = useState<Filter>("all");
  // A skill picked in the capability matrix overrides the category tabs.
  const filter: Filter = tech ? "all" : groupFilter;

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const p of projects) c[p.group] = (c[p.group] ?? 0) + 1;
    return c;
  }, []);

  const visible = useMemo(() => {
    if (tech) {
      const slugs = new Set(projectsUsing(tech).map((p) => p.slug));
      return projects.filter((p) => slugs.has(p.slug));
    }
    return filter === "all" ? projects : projects.filter((p) => p.group === filter);
  }, [tech, filter]);
  const spans = useMemo(() => desktopSpans(visible, filter === "all" && !tech), [visible, filter, tech]);

  return (
    <section id="work" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Selected work"
          title={`${projects.length} systems, built end to end.`}
          lede="Every one started from a real problem, not a tutorial. Open any project for the problem, the architecture decisions behind it, and what it measurably delivered."
        />

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {projectGroups.map((g) => {
            const active = filter === g.id && !tech;
            return (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setTech(null);
                  setFilter(g.id);
                }}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "text-invert-fg" : "text-muted hover:text-fg"
                }`}
              >
                {active && (
                  <motion.span layoutId="work-filter" transition={spring} className="absolute inset-0 rounded-full bg-invert-bg" aria-hidden />
                )}
                <span className="relative flex items-center gap-2">
                  {g.label}
                  <span className={`font-mono text-[0.65rem] ${active ? "text-invert-fg/70" : "text-subtle"}`}>{counts[g.id] ?? 0}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2 font-mono text-xs text-subtle" aria-live="polite">
          <AnimatePresence initial={false}>
            {tech && (
              <motion.span
                key="tech"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={spring}
                className="inline-flex items-center gap-1 rounded-full border border-accent/50 bg-accent-soft py-1 pl-2.5 pr-1 text-accent"
              >
                uses {tech}
                <button
                  type="button"
                  onClick={() => setTech(null)}
                  aria-label={`Clear filter: ${tech}`}
                  className="grid size-5 place-items-center rounded-full hover:bg-accent/15"
                >
                  <X className="size-3" aria-hidden />
                </button>
              </motion.span>
            )}
          </AnimatePresence>
          <span className="flex items-center gap-1">
            showing
            <span className="relative inline-flex h-[1.2em] overflow-hidden tabular-nums text-fg">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={visible.length}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={spring}
                  className="block"
                >
                  {visible.length}
                </motion.span>
              </AnimatePresence>
            </span>
            / {projects.length}
          </span>
        </div>
        </div>

        <motion.ul layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => {
              const lgSpan = spans[i] ?? 1;
              const wide = lgSpan > 1;
              const mdClass = visible.length % 2 === 1 && i === visible.length - 1 ? "md:col-span-2" : "md:col-span-1";
              return (
                <motion.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={spring}
                  className={`min-w-0 ${mdClass} ${lgSpanClass[lgSpan]}`}
                >
                  <ProjectCard project={p} wide={wide} banner={lgSpan === 3} onOpen={() => openCaseStudy(p.slug)} />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </div>

      <CaseStudyDrawer />
    </section>
  );
}

function ProjectCard({
  project,
  wide,
  banner,
  onOpen,
}: {
  project: Project;
  wide: boolean;
  banner: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={spring} className="h-full">
      <SpotlightCard className="ring-glow group h-full transition-colors hover:border-line-strong">
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open case study: ${project.name}`}
          className={`flex h-full w-full flex-col p-4 text-left sm:p-5 ${banner ? "lg:flex-row lg:items-center lg:gap-8" : ""}`}
        >
          <motion.div layoutId={`shot-${project.slug}`} transition={spring} className={`w-full ${banner ? "lg:w-[56%] lg:shrink-0" : ""}`}>
            <ProjectShot
              project={project}
              hoverZoom
              sizes={wide ? "(min-width: 1024px) 66vw, (min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
            />
          </motion.div>

          <div className="flex min-w-0 flex-1 flex-col self-stretch">
            <div className={`mt-5 flex flex-wrap items-center gap-2 ${banner ? "lg:mt-0" : ""}`}>
              <span className="tag">{project.category}</span>
              {project.liveUrl && project.group !== "tools" && (
                <span className="flex items-center gap-1.5 font-mono text-[0.65rem] text-accent">
                  <span className="size-1.5 rounded-full bg-accent" /> live
                </span>
              )}
            </div>

            <motion.h3 layoutId={`title-${project.slug}`} transition={spring} className="mt-3 text-xl font-semibold tracking-tight text-fg">
              {project.name}
            </motion.h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{project.tagline}</p>

            <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
              {project.metrics.map((m) => (
                <div key={m.label} className="min-w-0">
                  <dt className="sr-only">{m.label}</dt>
                  <dd className="truncate font-mono text-base font-medium text-fg sm:text-lg">{m.value}</dd>
                  <dd className="mt-0.5 text-[0.7rem] leading-tight text-subtle">{m.label}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <ul className="flex flex-wrap gap-1.5">
                {project.stack.slice(0, wide ? 5 : 3).map((s) => (
                  <li key={s} className="tag">
                    {s}
                  </li>
                ))}
              </ul>
              <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-fg">
                <span className="hidden sm:inline">Case study</span>
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </span>
            </div>
          </div>
        </button>
      </SpotlightCard>
    </motion.div>
  );
}
