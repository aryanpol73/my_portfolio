"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ExternalLink, Lock, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { projects } from "@/data/portfolio";
import { spring } from "@/lib/motion";
import { scrollToSection } from "@/lib/scroll";
import { GitHubIcon } from "./BrandIcons";
import { useCaseStudy } from "./Providers";
import { ProjectShot } from "./ProjectShot";

export function CaseStudyDrawer() {
  const { activeSlug, openCaseStudy, closeCaseStudy } = useCaseStudy();
  const index = projects.findIndex((p) => p.slug === activeSlug);
  const project = index >= 0 ? projects[index] : undefined;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const isOpen = Boolean(project);

  // Scroll lock, focus management and keyboard handling while open.
  useEffect(() => {
    if (!isOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbar}px`;
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCaseStudy();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = "";
      returnFocus.current?.focus?.({ preventScroll: true });
    };
  }, [isOpen, closeCaseStudy]);

  // Reset the panel scroll when switching between projects.
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [activeSlug]);

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[70]" role="presentation">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCaseStudy}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={spring}
            className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col overflow-y-auto overscroll-contain border-l border-line bg-canvas shadow-2xl"
          >
            {/* Sticky header */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-[var(--nav)] px-5 py-3 backdrop-blur-xl sm:px-8">
              <span className="font-mono text-xs text-subtle">
                Case study {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1">
                {prev && (
                  <button
                    type="button"
                    onClick={() => openCaseStudy(prev.slug)}
                    aria-label={`Previous case study: ${prev.name}`}
                    className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                  >
                    <ArrowLeft className="size-4" aria-hidden />
                  </button>
                )}
                {next && (
                  <button
                    type="button"
                    onClick={() => openCaseStudy(next.slug)}
                    aria-label={`Next case study: ${next.name}`}
                    className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                  >
                    <ArrowRight className="size-4" aria-hidden />
                  </button>
                )}
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closeCaseStudy}
                  aria-label="Close case study"
                  className="ml-1 grid size-9 place-items-center rounded-full border border-line text-fg transition-colors hover:bg-surface-2"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="px-5 pb-12 pt-6 sm:px-8"
              >
                <span className="tag">{project.category}</span>
                <motion.h2
                  layoutId={`title-${project.slug}`}
                  transition={spring}
                  id="case-study-title"
                  className="display mt-4 text-3xl text-fg sm:text-4xl"
                >
                  {project.name}
                </motion.h2>
                <p className="mt-3 text-base leading-relaxed text-muted">{project.summary}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
                  >
                    <GitHubIcon className="size-4" />
                    View Source
                  </a>
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-invert-bg px-4 py-2.5 text-sm font-semibold text-invert-fg transition-transform hover:scale-[1.02]"
                    >
                      <ExternalLink className="size-4" aria-hidden />
                      {project.liveLabel ?? "Live Demo"}
                    </a>
                  ) : (
                    <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-line-strong px-4 py-2.5 text-sm text-subtle">
                      <Lock className="size-4" aria-hidden />
                      Not deployed yet
                    </span>
                  )}
                </div>
                {project.liveNote && <p className="mt-2 text-xs text-subtle">{project.liveNote}</p>}

                <motion.div layoutId={`shot-${project.slug}`} transition={spring} className="mt-8">
                  <ProjectShot project={project} sizes="(min-width: 672px) 640px, 100vw" />
                </motion.div>
                {project.imageNote && <p className="mt-2 font-mono text-[0.68rem] text-subtle">{project.imageNote}</p>}

                <dl className="mt-6 grid grid-cols-3 gap-3">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="rounded-xl border border-line bg-surface p-3 sm:p-4">
                      <dt className="sr-only">{m.label}</dt>
                      <dd className="font-mono text-lg font-medium text-fg sm:text-2xl">{m.value}</dd>
                      <dd className="mt-1 text-[0.7rem] leading-tight text-subtle sm:text-xs">{m.label}</dd>
                    </div>
                  ))}
                </dl>

                <Block label="01 · The problem">
                  <p className="text-[0.95rem] leading-relaxed text-muted">{project.problem}</p>
                </Block>

                <Block label="02 · System architecture & decisions">
                  <ol className="space-y-4">
                    {project.architecture.map((a, i) => (
                      <li key={a.title} className="relative border-l border-line pl-5">
                        <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full border border-line-strong bg-canvas" />
                        <p className="font-mono text-[0.7rem] text-subtle">{String(i + 1).padStart(2, "0")}</p>
                        <p className="mt-0.5 font-semibold text-fg">{a.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{a.detail}</p>
                      </li>
                    ))}
                  </ol>
                </Block>

                <Block label="03 · Measurable outcomes">
                  <ul className="space-y-3">
                    {project.outcomes.map((o) => (
                      <li key={o} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                          <Check className="size-3" aria-hidden />
                        </span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </Block>

                <Block label="Tech stack">
                  <ul className="flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <li key={s} className="tag">
                        {s}
                      </li>
                    ))}
                  </ul>
                </Block>

                <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-semibold text-fg">Need something built to this standard?</p>
                    <p className="mt-1 text-sm text-muted">Tell me about it. I reply within one business day.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeCaseStudy();
                      window.setTimeout(() => scrollToSection("contact"), 320);
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-invert-bg px-4 py-2.5 text-sm font-semibold text-invert-fg"
                  >
                    Start a Project
                    <ArrowUpRight className="size-4" aria-hidden />
                  </button>
                </div>
              </motion.article>
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h3 className="eyebrow mb-4">{label}</h3>
      {children}
    </section>
  );
}
