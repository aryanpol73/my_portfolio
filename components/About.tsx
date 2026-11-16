"use client";

import { FileCheck2, MessagesSquare, MonitorPlay } from "lucide-react";
import { bio, principles, profile } from "@/data/portfolio";
import { Reveal, RevealItem } from "./Reveal";
import { SpotlightCard } from "./SpotlightCard";

const principleIcons = [MessagesSquare, MonitorPlay, FileCheck2];

export function About() {
  return (
    <section id="about" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal>
          <RevealItem>
            <p className="eyebrow mb-4 flex items-center gap-2">
              <span className="h-px w-6 bg-line-strong" aria-hidden />
              About
            </p>
          </RevealItem>
          <RevealItem>
            <h2 className="display text-3xl text-fg sm:text-4xl md:text-[2.75rem]">
              An engineer who treats your product like it&apos;s going to production. Because it is.
            </h2>
          </RevealItem>
          <div className="mt-8 space-y-4">
            {bio.map((line) => (
              <RevealItem key={line}>
                <p className="text-base leading-relaxed text-muted md:text-lg">{line}</p>
              </RevealItem>
            ))}
          </div>
          <RevealItem>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="tag">{profile.role}</span>
              <span className="tag">{profile.location}</span>
              <span className="tag">Remote · clients worldwide</span>
            </div>
          </RevealItem>
        </Reveal>

        <Reveal className="flex flex-col gap-3 lg:pt-12" delay={0.1}>
          {principles.map((p, i) => {
            const Icon = principleIcons[i] ?? MessagesSquare;
            return (
              <RevealItem key={p.title}>
                <SpotlightCard className="flex gap-4 p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-fg">
                    <Icon className="size-[18px]" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-tight text-fg">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{p.body}</p>
                  </div>
                </SpotlightCard>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
