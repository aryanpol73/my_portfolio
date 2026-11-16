"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { moreBuilds, projects, type Project } from "@/data/portfolio";
import { fadeUp, spring, stagger, viewport } from "@/lib/motion";
import { CaseStudyDrawer } from "./CaseStudyDrawer";
import { useCaseStudy } from "./Providers";
import { ProjectVisual } from "./ProjectVisual";
import { Reveal, RevealItem, SectionHeader } from "./Reveal";
import { SpotlightCard } from "./SpotlightCard";

const spans = ["lg:col-span-2", "lg:col-span-1", "lg:col-span-1", "lg:col-span-2"];

export function Work() {
  const { openCaseStudy } = useCaseStudy();

  return (
    <section id="work" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Selected work"
          title="Four systems, built to run in production."
          lede="Each one started from a real bottleneck, not a tutorial. Open any card for the problem, the architecture decisions behind it, and what it measurably delivered."
        />

        <motion.ul
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          {projects.map((p, i) => (
            <motion.li key={p.slug} variants={fadeUp} className={`min-w-0 ${spans[i] ?? ""}`}>
              <ProjectCard project={p} wide={i === 0 || i === 3} onOpen={() => openCaseStudy(p.slug)} />
            </motion.li>
          ))}
        </motion.ul>

        <Reveal className="mt-20">
          <RevealItem>
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="eyebrow">Also shipped</p>
              <span className="h-px flex-1 bg-line" aria-hidden />
            </div>
          </RevealItem>
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {moreBuilds.map((b) => (
              <RevealItem as="li" key={b.name} className="bg-canvas">
                <a
                  href={b.liveUrl ?? b.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col gap-2 p-5 transition-colors hover:bg-surface"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold tracking-tight text-fg">{b.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="tag">{b.kind}</span>
                      <ArrowUpRight
                        className="size-4 text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
                        aria-hidden
                      />
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">{b.line}</p>
                </a>
              </RevealItem>
            ))}
          </ul>
        </Reveal>
      </div>

      <CaseStudyDrawer />
    </section>
  );
}

function ProjectCard({ project, wide, onOpen }: { project: Project; wide: boolean; onOpen: () => void }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={spring} className="h-full">
      <SpotlightCard className="group h-full transition-colors hover:border-line-strong">
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open case study: ${project.name}`}
          className="flex h-full w-full flex-col p-4 text-left sm:p-5"
        >
          <motion.div layoutId={`visual-${project.slug}`} transition={spring} className="w-full">
            <ProjectVisual kind={project.visual} className={wide ? "h-48 sm:h-56" : "h-48"} />
          </motion.div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="tag">{project.category}</span>
            <span className="font-mono text-[0.7rem] text-subtle">{project.year}</span>
          </div>

          <motion.h3
            layoutId={`title-${project.slug}`}
            transition={spring}
            className="mt-3 text-xl font-semibold tracking-tight text-fg"
          >
            {project.name}
          </motion.h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{project.tagline}</p>

          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
            {project.metrics.map((m) => (
              <div key={m.label} className="min-w-0">
                <dt className="sr-only">{m.label}</dt>
                <dd className="font-mono text-base font-medium text-fg sm:text-lg">{m.value}</dd>
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
              <ArrowUpRight
                className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </div>
        </button>
      </SpotlightCard>
    </motion.div>
  );
}
