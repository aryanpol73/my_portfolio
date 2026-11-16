"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, CalendarClock, Check, ChevronDown, Copy, Loader2, Mail } from "lucide-react";
import { useEffect, useId, useState, type FormEvent } from "react";
import { budgetRanges, profile, services, type BudgetRange } from "@/data/portfolio";
import {
  BRIEF_MAX,
  buildMailto,
  validateInquiry,
  type InquiryErrors,
  type InquiryPayload,
  type InquiryService,
} from "@/lib/inquiry";
import { spring } from "@/lib/motion";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";
import { useInquiry, useToast } from "./Providers";
import { Reveal, RevealItem } from "./Reveal";
import { SpotlightCard } from "./SpotlightCard";

type Status = "idle" | "submitting" | "sent" | "mailto" | "error";

const empty: InquiryPayload = { name: "", email: "", service: "", budget: "", brief: "", website: "" };

export function Contact() {
  const { service: requested, nonce } = useInquiry();
  const { showToast } = useToast();
  const [form, setForm] = useState<InquiryPayload>(empty);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [flash, setFlash] = useState(false);
  const [copied, setCopied] = useState(false);
  const ids = useId();

  // Pre-select the service when a visitor clicks "Inquire" on a service card.
  useEffect(() => {
    if (!requested || nonce === 0) return;
    setForm((f) => ({ ...f, service: requested }));
    setStatus((s) => (s === "sent" || s === "mailto" ? "idle" : s));
    setFlash(true);
    const t = window.setTimeout(() => setFlash(false), 1600);
    return () => window.clearTimeout(t);
  }, [requested, nonce]);

  function update<K extends keyof InquiryPayload>(key: K, value: InquiryPayload[K]) {
    const next = { ...form, [key]: value };
    setForm(next);
    if (submitted) setErrors(validateInquiry(next));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    const found = validateInquiry(form);
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      document.getElementById(`${ids}-${firstKey}`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (data.error === "not_configured") {
        window.location.href = buildMailto(profile.email, form);
        setStatus("mailto");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setForm(empty);
    setErrors({});
    setSubmitted(false);
    setStatus("idle");
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = profile.email;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    showToast("Email copied to clipboard");
    window.setTimeout(() => setCopied(false), 2000);
  }

  const bookingHref =
    profile.bookingUrl ||
    `mailto:${profile.email}?subject=${encodeURIComponent("15-min discovery call")}&body=${encodeURIComponent(
      "Hi Aryan,\n\nI'd like to book a 15-minute discovery call.\n\nA few times that work for me (with timezone):\n- \n- \n\nWhat I'm building, in one line:\n",
    )}`;

  const sent = status === "sent" || status === "mailto";

  return (
    <section id="contact" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Left: pitch + direct shortcuts */}
        <Reveal>
          <RevealItem>
            <p className="eyebrow mb-4 flex items-center gap-2">
              <span className="h-px w-6 bg-line-strong" aria-hidden />
              Start a project
            </p>
          </RevealItem>
          <RevealItem>
            <h2 className="display text-3xl text-fg sm:text-4xl md:text-[2.75rem]">Tell me what you&apos;re building.</h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              Share a few lines about the problem and your timeline. You&apos;ll get a reply within one business day
              with questions, or a rough plan if the scope is already clear.
            </p>
          </RevealItem>

          <RevealItem>
            <div className="mt-10 space-y-3">
              <SpotlightCard className="flex items-center justify-between gap-3 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-fg">
                    <Mail className="size-[18px]" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="eyebrow">Email</p>
                    <a href={`mailto:${profile.email}`} className="block truncate text-sm font-medium text-fg hover:text-accent">
                      {profile.email}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-fg transition-colors hover:bg-surface-2"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? "done" : "copy"}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={spring}
                      className="grid place-items-center"
                    >
                      {copied ? <Check className="size-3.5 text-accent" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
                    </motion.span>
                  </AnimatePresence>
                  {copied ? "Copied" : "Copy"}
                </button>
              </SpotlightCard>

              <a
                href={bookingHref}
                target={profile.bookingUrl ? "_blank" : undefined}
                rel={profile.bookingUrl ? "noreferrer" : undefined}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong"
              >
                <span className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-fg">
                    <CalendarClock className="size-[18px]" aria-hidden />
                  </span>
                  <span>
                    <span className="eyebrow block">Prefer to talk?</span>
                    <span className="text-sm font-medium text-fg">Book a 15-Min Discovery Call</span>
                  </span>
                </span>
                <ArrowRight className="size-4 text-subtle transition-transform group-hover:translate-x-1 group-hover:text-fg" aria-hidden />
              </a>

              <div className="flex gap-2 pt-2">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  className="grid size-11 place-items-center rounded-full border border-line text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  <GitHubIcon className="size-[18px]" />
                </a>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  className="grid size-11 place-items-center rounded-full border border-line text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  <LinkedInIcon className="size-[18px]" />
                </a>
              </div>
            </div>
          </RevealItem>
        </Reveal>

        {/* Right: inquiry form */}
        <Reveal delay={0.1}>
          <RevealItem>
            <SpotlightCard className="relative overflow-hidden p-5 sm:p-7">
              <AnimatePresence mode="wait" initial={false}>
                {sent ? (
                  <Confirmation key="sent" viaMailto={status === "mailto"} name={form.name} onReset={reset} />
                ) : (
                  <motion.form
                    key="form"
                    noValidate
                    onSubmit={onSubmit}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                    aria-label="Project inquiry"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field id={`${ids}-name`} label="Name" error={errors.name}>
                        <input
                          id={`${ids}-name`}
                          type="text"
                          autoComplete="name"
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? `${ids}-name-err` : undefined}
                          className={inputClass(Boolean(errors.name))}
                          placeholder="Jordan Lee"
                        />
                      </Field>
                      <Field id={`${ids}-email`} label="Email" error={errors.email}>
                        <input
                          id={`${ids}-email`}
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? `${ids}-email-err` : undefined}
                          className={inputClass(Boolean(errors.email))}
                          placeholder="jordan@company.com"
                        />
                      </Field>
                    </div>

                    <Field id={`${ids}-service`} label="Service interest" error={errors.service}>
                      <div className="relative">
                        <motion.div
                          aria-hidden
                          className="pointer-events-none absolute -inset-1 rounded-[0.9rem] border-2 border-accent"
                          initial={false}
                          animate={{ opacity: flash ? 1 : 0, scale: flash ? 1 : 0.98 }}
                          transition={spring}
                        />
                        <select
                          id={`${ids}-service`}
                          value={form.service}
                          onChange={(e) => update("service", e.target.value as InquiryService | "")}
                          aria-invalid={Boolean(errors.service)}
                          aria-describedby={errors.service ? `${ids}-service-err` : undefined}
                          className={`${inputClass(Boolean(errors.service))} appearance-none pr-10 ${form.service ? "" : "text-subtle"}`}
                        >
                          <option value="" disabled>
                            Choose a service
                          </option>
                          {services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title}
                            </option>
                          ))}
                          <option value="other">Something else</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />
                      </div>
                    </Field>

                    <fieldset>
                      <legend className="mb-2 text-sm font-medium text-fg">Budget range</legend>
                      <div
                        role="radiogroup"
                        aria-label="Budget range"
                        aria-describedby={errors.budget ? `${ids}-budget-err` : undefined}
                        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                      >
                        {budgetRanges.map((b, i) => (
                          <BudgetPill
                            key={b}
                            id={i === 0 ? `${ids}-budget` : undefined}
                            value={b}
                            selected={form.budget === b}
                            onSelect={() => update("budget", b)}
                          />
                        ))}
                      </div>
                      <ErrorText id={`${ids}-budget-err`} message={errors.budget} />
                    </fieldset>

                    <Field id={`${ids}-brief`} label="Project brief" error={errors.brief}>
                      <textarea
                        id={`${ids}-brief`}
                        rows={5}
                        value={form.brief}
                        maxLength={BRIEF_MAX + 200}
                        onChange={(e) => update("brief", e.target.value)}
                        aria-invalid={Boolean(errors.brief)}
                        aria-describedby={errors.brief ? `${ids}-brief-err` : `${ids}-brief-count`}
                        className={`${inputClass(Boolean(errors.brief))} resize-y leading-relaxed`}
                        placeholder="What are you building, who is it for, and what does 'done' look like? Any deadline?"
                      />
                      <p id={`${ids}-brief-count`} className="mt-1.5 text-right font-mono text-[0.65rem] text-subtle">
                        {form.brief.trim().length} / {BRIEF_MAX}
                      </p>
                    </Field>

                    {/* Honeypot */}
                    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                      <label>
                        Website
                        <input
                          tabIndex={-1}
                          autoComplete="off"
                          value={form.website}
                          onChange={(e) => update("website", e.target.value)}
                        />
                      </label>
                    </div>

                    <AnimatePresence>
                      {status === "error" && (
                        <motion.p
                          role="alert"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-start gap-2 overflow-hidden rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300"
                        >
                          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                          <span>
                            The message couldn&apos;t be sent.{" "}
                            <a href={buildMailto(profile.email, form)} className="font-semibold underline underline-offset-2">
                              Send it by email instead
                            </a>
                            .
                          </span>
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="submit"
                      disabled={status === "submitting"}
                      whileTap={{ scale: 0.98 }}
                      transition={spring}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-invert-bg px-5 py-3.5 text-sm font-semibold text-invert-fg transition-opacity disabled:opacity-70"
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="size-4 animate-spin" aria-hidden />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Project Inquiry
                          <ArrowRight className="size-4" aria-hidden />
                        </>
                      )}
                    </motion.button>
                    <p className="text-center text-xs text-subtle">No newsletters, no sharing. Just a reply from me.</p>
                  </motion.form>
                )}
              </AnimatePresence>
            </SpotlightCard>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}

function inputClass(invalid: boolean): string {
  return `w-full rounded-xl border bg-canvas px-3.5 py-3 text-sm text-fg placeholder:text-subtle transition-[border-color,box-shadow] outline-none focus:border-line-strong focus:ring-4 focus:ring-[var(--accent-soft)] ${
    invalid ? "border-red-500/60" : "border-line"
  }`;
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-fg">
        {label}
      </label>
      {children}
      <ErrorText id={`${id}-err`} message={error} />
    </div>
  );
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden pt-1.5 text-xs text-red-600 dark:text-red-400"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function BudgetPill({
  id,
  value,
  selected,
  onSelect,
}: {
  id?: string;
  value: BudgetRange;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      id={id}
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`relative rounded-xl border px-3 py-2.5 font-mono text-xs transition-colors ${
        selected ? "border-transparent text-invert-fg" : "border-line text-muted hover:border-line-strong hover:text-fg"
      }`}
    >
      {selected && (
        <motion.span layoutId="budget-pill" transition={spring} className="absolute inset-0 rounded-xl bg-invert-bg" aria-hidden />
      )}
      <span className="relative">{value}</span>
    </button>
  );
}

function Confirmation({ viaMailto, name, onReset }: { viaMailto: boolean; name: string; onReset: () => void }) {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={spring}
      className="flex min-h-[460px] flex-col items-center justify-center py-10 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ...spring, delay: 0.05 }}
        className="relative grid size-16 place-items-center rounded-full bg-accent-soft"
      >
        <span className="pulse-ring absolute inset-0 rounded-full bg-accent/30" />
        <svg viewBox="0 0 24 24" className="relative size-8 text-accent" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
          />
        </svg>
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="display mt-6 text-2xl text-fg"
      >
        {viaMailto ? "Almost there" : `Thanks${first ? `, ${first}` : ""}. Brief received.`}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="mt-2 max-w-sm text-sm leading-relaxed text-muted"
      >
        {viaMailto
          ? "Your email app has opened with the brief filled in. Hit send there and it lands straight in my inbox."
          : "I'll read it properly and reply within one business day, usually with a few sharp questions or a first plan."}
      </motion.p>
      <motion.button
        type="button"
        onClick={onReset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 rounded-full border border-line px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
      >
        Send another inquiry
      </motion.button>
    </motion.div>
  );
}
