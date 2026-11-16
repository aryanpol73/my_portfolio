"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, FileText } from "lucide-react";
import { useRef, useState } from "react";
import { capabilities, processSteps } from "@/data/portfolio";
import { projectsUsing } from "@/lib/capabilities";
import { fadeUp, spring, stagger, viewport } from "@/lib/motion";
import { scrollToSection } from "@/lib/scroll";
import { useTechFilter } from "./Providers";
import { Reveal, RevealItem, SectionHeader } from "./Reveal";
import { SpotlightCard } from "./SpotlightCard";

export function Process() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 85%", "start 30%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [reached, setReached] = useState(0);
  const last = processSteps.length - 1;

  // Step i lights up once the line has travelled to it.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = v <= 0.01 ? 0 : Math.min(processSteps.length, Math.floor(v * last + 0.04) + 1);
    setReached(n);
  });

  return (
    <section id="process" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="How I work"
          title="From kickoff to handoff, with no surprises."
          lede="A fixed scope you sign off on, a working preview every week, and a codebase your team can own on day one."
        />

        <div ref={timelineRef} className="relative">
          {/* Rail and scroll-driven fill: vertical on mobile, horizontal on desktop */}
          <div aria-hidden className="absolute left-[19px] top-2 bottom-2 w-px bg-line lg:hidden" />
          <motion.div
            aria-hidden
            style={{ scaleY: fill }}
            className="absolute left-[19px] top-2 bottom-2 w-[2px] -translate-x-[0.5px] origin-top bg-[linear-gradient(180deg,var(--accent),var(--accent-2),var(--accent-3))] shadow-[0_0_10px_var(--accent-glow)] lg:hidden"
          />
          <div aria-hidden className="absolute left-5 right-5 top-5 hidden h-px bg-line lg:block" />
          <motion.div
            aria-hidden
            style={{ scaleX: fill }}
            className="absolute left-5 right-5 top-5 hidden h-[2px] -translate-y-[0.5px] origin-left bg-[linear-gradient(90deg,var(--accent),var(--accent-2),var(--accent-3))] shadow-[0_0_10px_var(--accent-glow)] lg:block"
          />

          <motion.ol
            className="grid gap-8 lg:grid-cols-4 lg:gap-6"
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
          >
            {processSteps.map((s, i) => {
              const on = i < reached;
              return (
                <motion.li key={s.step} variants={fadeUp} className="relative pl-14 lg:pl-0">
                  <motion.span
                    animate={{ scale: on ? 1.08 : 1 }}
                    transition={spring}
                    className={`absolute left-0 top-0 grid size-10 place-items-center rounded-full border font-mono text-xs font-medium transition-colors duration-500 lg:relative ${
                      on
                        ? "border-transparent bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-[var(--on-gradient)] shadow-[0_0_18px_var(--accent-glow)]"
                        : "border-line-strong bg-canvas text-fg"
                    }`}
                  >
                    {s.step}
                  </motion.span>
                  <h3 className={`text-lg font-semibold tracking-tight transition-colors duration-500 lg:mt-6 ${on ? "text-fg" : "text-muted"}`}>
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                  <motion.p
                    initial={false}
                    animate={{ opacity: on ? 1 : 0.35, y: on ? 0 : 4, scale: on ? 1 : 0.97 }}
                    transition={spring}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent-soft px-2.5 py-1.5 font-mono text-[0.7rem] text-accent"
                  >
                    <FileText className="size-3.5" aria-hidden />
                    {s.artifact}
                  </motion.p>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>

        {/* Capability matrix: every skill with a shipped project links to the work that proves it */}
        <Reveal className="mt-24">
          <RevealItem>
            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow mb-3">Capability matrix</p>
                <h3 className="display text-2xl text-fg sm:text-3xl">Verified in shipped code, not a skills list.</h3>
              </div>
              <p className="max-w-xs text-sm text-subtle">
                Every tool below is used in at least one of my public repositories. Pick one with a count to see the projects that use it.
              </p>
            </div>
          </RevealItem>
          <div className="grid gap-4 sm:grid-cols-2">
            {capabilities.map((group) => (
              <RevealItem key={group.domain}>
                <SpotlightCard className="h-full p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-semibold text-fg">{group.domain}</h4>
                    <span className="font-mono text-xs text-subtle">{String(group.items.length).padStart(2, "0")}</span>
                  </div>
                  <ul className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <CapabilityTag key={item} item={item} />
                    ))}
                  </ul>
                </SpotlightCard>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CapabilityTag({ item }: { item: string }) {
  const { setTech } = useTechFilter();
  const used = projectsUsing(item);

  if (used.length === 0) {
    return <li className="tag cursor-default">{item}</li>;
  }

  const names = used.map((p) => p.name).join(", ");

  return (
    <motion.li whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} transition={spring} className="group/cap relative">
      <button
        type="button"
        onClick={() => {
          setTech(item);
          scrollToSection("work");
        }}
        aria-label={`${item}: show the ${used.length} project${used.length > 1 ? "s" : ""} that use it (${names})`}
        className="tag cursor-pointer transition-colors hover:border-accent/60 hover:bg-accent-soft hover:text-fg focus-visible:border-accent/60"
      >
        {item}
        <span className="rounded bg-accent-soft px-1 text-[0.6rem] text-accent">{used.length}</span>
      </button>
      <span
        role="tooltip"
        className="tip pointer-events-none absolute bottom-[calc(100%+6px)] left-0 z-20 hidden w-max max-w-[min(16rem,80vw)] rounded-md bg-invert-bg px-2 py-1.5 font-mono text-[0.62rem] leading-snug text-invert-fg shadow-lg group-hover/cap:block group-focus-within/cap:block"
      >
        <span className="flex items-center gap-1">
          Used in {names}
          <ArrowUpRight className="size-3 shrink-0" aria-hidden />
        </span>
      </span>
    </motion.li>
  );
}
