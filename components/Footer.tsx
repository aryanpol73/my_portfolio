import { LogoMark } from "./LogoMark";
import { profile } from "@/data/portfolio";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-3">
          <LogoMark className="size-8 shrink-0 drop-shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105" />
          <div>
            <p className="text-sm font-semibold text-fg">{profile.name}</p>
            <p className="font-mono text-[0.7rem] text-subtle">
              © {new Date().getFullYear()} · {profile.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <GitHubIcon className="size-4" />
          </a>
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <LinkedInIcon className="size-4" />
          </a>
          <a href="#top" className="ml-2 font-mono text-xs text-subtle hover:text-fg">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
