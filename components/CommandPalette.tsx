"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Briefcase, CornerDownLeft, FileText, Hash, Mail, Moon, Search } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { navLinks, profile, projects } from "@/data/portfolio";
import { spring } from "@/lib/motion";
import { scrollToSection } from "@/lib/scroll";
import { toggleTheme } from "@/lib/theme";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";
import { useCaseStudy, useToast } from "./Providers";

const OPEN_EVENT = "open-command-palette";

/** Opens the palette from anywhere (the navbar button uses this). */
export function openCommandPalette(): void {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

interface Command {
  id: string;
  group: "Go to" | "Case studies" | "Actions";
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const { openCaseStudy, closeCaseStudy } = useCaseStudy();
  const { showToast } = useToast();
  const listId = useId();

  const close = useCallback(() => setOpen(false), []);

  const commands = useMemo<Command[]>(() => {
    const sections = [{ label: "Home", href: "#top" }, ...navLinks, { label: "Contact", href: "#contact" }];
    return [
      ...sections.map((s) => ({
        id: `go-${s.href}`,
        group: "Go to" as const,
        label: s.label,
        hint: "section",
        icon: Hash,
        run: () => {
          closeCaseStudy();
          scrollToSection(s.href.slice(1));
        },
      })),
      ...projects.map((p) => ({
        id: `cs-${p.slug}`,
        group: "Case studies" as const,
        label: p.name,
        hint: p.category.split(" · ")[0] ?? "",
        icon: FileText,
        run: () => openCaseStudy(p.slug),
      })),
      {
        id: "act-start",
        group: "Actions",
        label: "Start a project",
        hint: "contact form",
        icon: Briefcase,
        run: () => {
          closeCaseStudy();
          scrollToSection("contact");
        },
      },
      {
        id: "act-email",
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        icon: Mail,
        run: () => {
          navigator.clipboard
            .writeText(profile.email)
            .then(() => showToast("Email copied to clipboard"))
            .catch(() => showToast(profile.email));
        },
      },
      {
        id: "act-theme",
        group: "Actions",
        label: "Switch theme",
        hint: "light / dark",
        icon: Moon,
        run: () => toggleTheme({ x: window.innerWidth / 2, y: window.innerHeight / 3 }),
      },
      {
        id: "act-github",
        group: "Actions",
        label: "Open GitHub",
        hint: `github.com/${profile.githubUser}`,
        icon: GitHubIcon,
        run: () => window.open(profile.githubUrl, "_blank", "noopener,noreferrer"),
      },
      {
        id: "act-linkedin",
        group: "Actions",
        label: "Open LinkedIn",
        hint: "profile",
        icon: LinkedInIcon,
        run: () => window.open(profile.linkedinUrl, "_blank", "noopener,noreferrer"),
      },
    ];
  }, [openCaseStudy, closeCaseStudy, showToast]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.group} ${c.hint}`.toLowerCase().includes(q));
  }, [commands, query]);

  // Global shortcut and the navbar button.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setIndex(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      window.clearTimeout(t);
      returnFocus.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  function run(cmd: Command | undefined) {
    if (!cmd) return;
    setOpen(false);
    // Let the palette close before scrolling or opening a drawer.
    window.setTimeout(cmd.run, 60);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      // Keep the case-study drawer (which also listens for Escape) open underneath.
      e.stopPropagation();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[index]);
    } else if (e.key === "Tab") {
      // Focus stays in the search box; also keeps the drawer's focus trap from reacting.
      e.preventDefault();
      e.stopPropagation();
    }
  }

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette"
          className="fixed inset-0 z-[95] flex items-start justify-center bg-black/40 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          onKeyDown={onKeyDown}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={spring}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl shadow-black/40"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 shrink-0 text-subtle" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                placeholder="Jump to a section, open a case study…"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={results[index] ? `${listId}-${results[index].id}` : undefined}
                aria-autocomplete="list"
                className="h-14 w-full bg-transparent text-[0.95rem] text-fg outline-none placeholder:text-subtle"
              />
              <kbd className="rounded border border-line-strong px-1.5 py-0.5 font-mono text-[0.62rem] text-subtle">esc</kbd>
            </div>

            <div ref={listRef} id={listId} role="listbox" className="max-h-[min(52vh,420px)] overflow-y-auto p-2">
              {results.length === 0 && <p className="px-3 py-8 text-center text-sm text-subtle">No matches for &ldquo;{query}&rdquo;.</p>}
              {results.map((c, i) => {
                const header = c.group !== lastGroup ? c.group : null;
                lastGroup = c.group;
                const Icon = c.icon;
                const active = i === index;
                return (
                  <div key={c.id}>
                    {header && <p className="eyebrow px-3 pb-1.5 pt-3">{header}</p>}
                    <div
                      id={`${listId}-${c.id}`}
                      role="option"
                      aria-selected={active}
                      data-index={i}
                      onMouseMove={() => i !== index && setIndex(i)}
                      onClick={() => run(c)}
                      className={`relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                        active ? "text-fg" : "text-muted"
                      }`}
                    >
                      {active && (
                        <motion.span layoutId="palette-active" transition={spring} className="absolute inset-0 rounded-xl bg-surface-2" aria-hidden />
                      )}
                      <Icon className={`relative size-4 shrink-0 ${active ? "text-accent" : "text-subtle"}`} />
                      <span className="relative min-w-0 flex-1 truncate">{c.label}</span>
                      <span className="relative hidden max-w-[45%] truncate font-mono text-[0.66rem] text-subtle sm:inline">{c.hint}</span>
                      {active && <ArrowRight className="relative size-3.5 shrink-0 text-accent" aria-hidden />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[0.64rem] text-subtle">
              <span>↑↓ move</span>
              <span className="flex items-center gap-1">
                <CornerDownLeft className="size-3" aria-hidden /> open
              </span>
              <span className="ml-auto">{results.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
