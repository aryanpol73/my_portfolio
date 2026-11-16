"use client";

import { FileCheck2, GraduationCap, Heart, MessagesSquare, MonitorPlay, Users } from "lucide-react";
import { about, principles } from "@/data/portfolio";
import { Reveal, RevealItem } from "./Reveal";
import { SpotlightCard } from "./SpotlightCard";

const principleIcons = [MessagesSquare, MonitorPlay, FileCheck2];

export function About() {
  return (
    <section id="about" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <RevealItem>
              <p className="eyebrow mb-4 flex items-center gap-2">
                <span className="h-px w-6 bg-line-strong" aria-hidden />
                About
              </p>
            </RevealItem>
            <RevealItem>
              <h2 className="display text-3xl text-fg sm:text-4xl md:text-[2.75rem]">{about.heading}</h2>
            </RevealItem>
            <div className="mt-8 space-y-4">
              {about.bio.map((line) => (
                <RevealItem key={line}>
                  <p className="text-base leading-relaxed text-muted md:text-lg">{line}</p>
                </RevealItem>
              ))}
            </div>
            <RevealItem>
              <div className="mt-8 flex flex-wrap gap-2">
                {about.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </RevealItem>
          </Reveal>

          <Reveal className="flex flex-col gap-3 lg:pt-12" delay={0.1}>
            <RevealItem>
              <SpotlightCard className="p-5">
                <CardHeading icon={GraduationCap} label="Education" />
                <p className="mt-3 font-semibold tracking-tight text-fg">{about.education.degree}</p>
                <p className="mt-1 text-sm text-muted">{about.education.school}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="tag">{about.education.years}</span>
                  <span className="tag">{about.education.detail}</span>
                </div>
              </SpotlightCard>
            </RevealItem>

            <RevealItem>
              <SpotlightCard className="p-5">
                <CardHeading icon={Users} label="Leadership" />
                <ul className="mt-3 space-y-2.5">
                  {about.leadership.map((l) => (
                    <li key={l.role + l.org} className="text-sm">
                      <span className="font-medium text-fg">{l.role}</span>
                      <span className="text-muted">, {l.org}</span>
                      {"note" in l && <span className="block text-xs text-subtle">{l.note}</span>}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </RevealItem>

            <RevealItem>
              <SpotlightCard className="p-5">
                <CardHeading icon={Heart} label="Beyond code" />
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {about.interests.map((i) => (
                    <li key={i} className="tag">
                      {i}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </RevealItem>
          </Reveal>
        </div>

        <Reveal className="mt-14 grid gap-3 md:grid-cols-3">
          {principles.map((p, i) => {
            const Icon = principleIcons[i] ?? MessagesSquare;
            return (
              <RevealItem key={p.title}>
                <SpotlightCard className="flex h-full gap-4 p-5">
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

function CardHeading({ icon: Icon, label }: { icon: typeof Heart; label: string }) {
  return (
    <p className="eyebrow flex items-center gap-2">
      <Icon className="size-3.5" aria-hidden />
      {label}
    </p>
  );
}
