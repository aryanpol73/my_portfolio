import { projects, type Project } from "@/data/portfolio";

/** Capability names that are worded differently from the project stack entries they cover. */
const aliases: Record<string, string[]> = {
  "Gemini API": ["gemini"],
  "MCP servers": ["mcp"],
  "Pydantic schemas": ["pydantic"],
  "WebAuthn passkeys": ["webauthn"],
  "PWA / Service Workers": ["pwa"],
  "Supabase Edge Functions": ["edge functions"],
  "axe a11y": ["axe"],
};

/** Lowercase, drop version numbers and punctuation: "Next.js 15" → "next.js", "PostgreSQL + RLS" → "postgresql rls". */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[()]/g, " ")
    .replace(/[^a-z0-9.#]+/g, " ")
    .replace(/(^|\s)\d+(\.\d+)*(?=\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Major version written in a name, if any: "React 19" → "19", "Python 3.12" → "3". */
function majorVersion(s: string): string | null {
  return s.match(/(?:^|\s)(\d+)(?:\.\d+)*(?=\s|$)/)?.[1] ?? null;
}

function terms(capability: string): string[] {
  return aliases[capability] ?? capability.split(/\s*[/+]\s*/).map(normalize).filter(Boolean);
}

const cache = new Map<string, Project[]>();

/**
 * Projects whose stack uses this capability, matched on whole words so "SSE" never matches "Pydantic".
 * When both sides name a version they must agree, so "React 19" skips a project on React 18.
 */
export function projectsUsing(capability: string): Project[] {
  const hit = cache.get(capability);
  if (hit) return hit;
  const wanted = terms(capability);
  const wantedVersion = majorVersion(capability);
  const found = projects.filter((p) =>
    p.stack.some((s) => {
      const padded = ` ${normalize(s)} `;
      if (!wanted.some((t) => padded.includes(` ${t} `))) return false;
      const version = majorVersion(s);
      return !wantedVersion || !version || version === wantedVersion;
    }),
  );
  cache.set(capability, found);
  return found;
}
