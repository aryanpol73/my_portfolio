import Image from "next/image";
import type { Project } from "@/data/portfolio";

interface ProjectShotProps {
  project: Project;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Slow zoom on parent hover (parent needs the `group` class). */
  hoverZoom?: boolean;
}

/** A real screenshot of the project's home page, framed in a minimal browser window. */
export function ProjectShot({ project, className = "", sizes = "(min-width: 1024px) 50vw, 100vw", priority, hoverZoom }: ProjectShotProps) {
  return (
    <div className={`overflow-hidden rounded-xl border border-line bg-surface-2 shadow-lg shadow-black/10 ${className}`}>
      <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2 rounded-full bg-[#ff5f57]/80" />
          <span className="size-2 rounded-full bg-[#febc2e]/80" />
          <span className="size-2 rounded-full bg-[#28c840]/80" />
        </span>
        <span className="mx-auto max-w-[70%] truncate rounded-md bg-surface-2 px-3 py-0.5 text-center font-mono text-[0.62rem] text-subtle">
          {project.imageUrlLabel}
        </span>
        <span className="w-[34px]" aria-hidden />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.image}
          alt={`${project.name} home page`}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover object-top ${hoverZoom ? "transition-transform duration-700 ease-out group-hover:scale-[1.03]" : ""}`}
        />
      </div>
    </div>
  );
}
