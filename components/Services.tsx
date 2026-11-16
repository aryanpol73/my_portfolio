"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, LayoutTemplate, Sparkles, Waypoints } from "lucide-react";
import { services, type ServiceId } from "@/data/portfolio";
import { fadeUp, spring, stagger, viewport } from "@/lib/motion";
import { scrollToSection } from "@/lib/scroll";
import { useInquiry } from "./Providers";
import { SectionHeader } from "./Reveal";
import { SpotlightCard } from "./SpotlightCard";

const icons: Record<ServiceId, typeof LayoutTemplate> = {
  "web-apps": LayoutTemplate,
  "ai-workflows": Sparkles,
  "data-ml": Waypoints,
};

export function Services() {
  const { selectService } = useInquiry();

  function inquire(id: ServiceId) {
    selectService(id);
    scrollToSection("contact");
  }

  return (
    <section id="services" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Services"
          title="Three ways to work together."
          lede="Fixed-scope engagements with weekly demos. Each service is backed by systems I've already shipped, so you're buying a proven playbook, not an experiment."
        />

        <motion.ul
          className="grid gap-4 lg:grid-cols-3"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          {services.map((s) => {
            const Icon = icons[s.id];
            return (
              <motion.li key={s.id} variants={fadeUp} className="min-w-0">
                <motion.div whileHover={{ y: -4 }} transition={spring} className="h-full">
                  <SpotlightCard className="ring-glow flex h-full flex-col p-6 transition-colors hover:border-line-strong">
                    <div className="flex items-start justify-between">
                      <span className="grid size-11 place-items-center rounded-xl border border-line bg-surface-2 text-fg">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="font-mono text-xs text-subtle">{s.index}</span>
                    </div>

                    <h3 className="mt-6 text-xl font-semibold tracking-tight text-fg">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.pitch}</p>

                    <p className="eyebrow mt-6 mb-3">Deliverables</p>
                    <ul className="space-y-2.5">
                      {s.deliverables.map((d) => (
                        <li key={d} className="flex gap-2.5 text-sm text-muted">
                          <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                          {d}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 rounded-xl border border-line bg-surface-2/60 p-3.5">
                      <p className="eyebrow mb-1.5">Ideal for</p>
                      <p className="text-sm leading-relaxed text-muted">{s.idealFor}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-1.5">
                      <span className="tag">
                        <Clock className="size-3" aria-hidden />
                        {s.timeline}
                      </span>
                      {s.proof.map((p) => (
                        <span key={p} className="tag">
                          {p}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-6">
                      <button
                        type="button"
                        onClick={() => inquire(s.id)}
                        className="group flex w-full items-center justify-between rounded-xl border border-line-strong px-4 py-3 text-sm font-semibold text-fg transition-colors hover:bg-invert-bg hover:text-invert-fg"
                      >
                        Inquire About This Service
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                      </button>
                    </div>
                  </SpotlightCard>
                </motion.div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
