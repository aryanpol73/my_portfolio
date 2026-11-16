"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { capabilities, processSteps } from "@/data/portfolio";
import { fadeUp, spring, stagger, viewport } from "@/lib/motion";
import { Reveal, RevealItem, SectionHeader } from "./Reveal";
import { SpotlightCard } from "./SpotlightCard";

export function Process() {
  return (
    <section id="process" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="How I work"
          title="From kickoff to handoff, with no surprises."
          lede="A fixed scope you sign off on, a working preview every week, and a codebase your team can own on day one."
        />

        <div className="relative">
          {/* Connector line: horizontal on desktop, vertical on mobile */}
          <div aria-hidden className="absolute left-[19px] top-2 bottom-2 w-px bg-line lg:hidden" />
          <motion.div
            aria-hidden
            className="absolute left-[19px] top-2 hidden h-px origin-left bg-line-strong lg:left-5 lg:right-5 lg:top-5 lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewport}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.ol
            className="grid gap-8 lg:grid-cols-4 lg:gap-6"
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
          >
            {processSteps.map((s) => (
              <motion.li key={s.step} variants={fadeUp} className="relative pl-14 lg:pl-0">
                <span className="absolute left-0 top-0 grid size-10 place-items-center rounded-full border border-line-strong bg-canvas font-mono text-xs font-medium text-fg lg:relative">
                  {s.step}
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-fg lg:mt-6">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.7rem] text-accent">
                  <FileText className="size-3.5" aria-hidden />
                  {s.artifact}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>

        {/* Capability matrix */}
        <Reveal className="mt-24">
          <RevealItem>
            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow mb-3">Capability matrix</p>
                <h3 className="display text-2xl text-fg sm:text-3xl">Verified in shipped code, not a skills list.</h3>
              </div>
              <p className="max-w-xs text-sm text-subtle">Every tool below is used in at least one of my public repositories.</p>
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
                      <motion.li
                        key={item}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        transition={spring}
                        className="tag cursor-default transition-colors hover:border-line-strong hover:text-fg"
                      >
                        {item}
                      </motion.li>
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
