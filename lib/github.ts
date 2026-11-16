import { profile } from "@/data/portfolio";

export interface GitHubStats {
  /** Public repositories, forks included (the number on the GitHub profile). */
  publicRepos: number;
  /** Public, non-fork repositories pushed to in the last 90 days. */
  activeRepos90d: number;
  /** Public, non-fork repositories that have a website set. */
  liveSites: number;
  lastPush: string | null;
  topLanguages: { name: string; share: number }[];
  /** "bytes" matches GitHub's own language bar; "repos" counts each repo's main language once. */
  languageBasis: "bytes" | "repos";
  /** Contribution calendar for the last year (API with a token, else the public profile calendar). Null if unavailable. */
  contributions: { total: number; weeks: number[][] } | null;
  /** When these numbers were fetched (ISO). */
  fetchedAt: string;
  live: boolean;
}

/** How often the page re-fetches GitHub, in seconds. */
export const GITHUB_REVALIDATE = 3600;

/** Snapshot from 16 Nov 2026, used only if GitHub is unreachable during a build. */
const FALLBACK: GitHubStats = {
  publicRepos: 47,
  activeRepos90d: 25,
  liveSites: 13,
  lastPush: null,
  topLanguages: [
    { name: "TypeScript", share: 0.518 },
    { name: "Python", share: 0.337 },
    { name: "JavaScript", share: 0.074 },
    { name: "HTML", share: 0.042 },
  ],
  languageBasis: "bytes",
  contributions: null,
  fetchedAt: "2026-11-16T12:00:00Z",
  live: false,
};

const DAY = 86_400_000;
const fetchOpts = (headers: HeadersInit) => ({ headers, next: { revalidate: GITHUB_REVALIDATE } });

interface RepoLite {
  fork: boolean;
  pushedAt: string;
  homepage: string | null;
}

function summarize(repos: RepoLite[], now: number) {
  const original = repos.filter((r) => !r.fork);
  return {
    activeRepos90d: original.filter((r) => now - Date.parse(r.pushedAt) < 90 * DAY).length,
    liveSites: original.filter((r) => (r.homepage ?? "").trim().length > 0).length,
    lastPush: original.reduce<string | null>((latest, r) => (!latest || r.pushedAt > latest ? r.pushedAt : latest), null),
  };
}

function topShares(totals: Map<string, number>) {
  const sum = [...totals.values()].reduce((a, b) => a + b, 0) || 1;
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, v]) => ({ name, share: v / sum }));
}

/* ---------- With a token: one GraphQL request ---------- */

const QUERY = `query($login: String!) {
  user(login: $login) {
    allPublic: repositories(privacy: PUBLIC, ownerAffiliations: OWNER) { totalCount }
    repositories(first: 100, privacy: PUBLIC, ownerAffiliations: OWNER, orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes {
        isFork
        pushedAt
        homepageUrl
        languages(first: 20) { edges { size node { name } } }
      }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { contributionCount } }
      }
    }
  }
}`;

interface GraphQLResponse {
  data?: {
    user: {
      allPublic: { totalCount: number };
      repositories: {
        nodes: {
          isFork: boolean;
          pushedAt: string;
          homepageUrl: string | null;
          languages: { edges: { size: number; node: { name: string } }[] };
        }[];
      };
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: { contributionDays: { contributionCount: number }[] }[];
        };
      };
    } | null;
  };
  errors?: unknown[];
}

async function viaGraphQL(token: string): Promise<GitHubStats> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    ...fetchOpts({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }),
    body: JSON.stringify({ query: QUERY, variables: { login: profile.githubUser } }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`);
  const json = (await res.json()) as GraphQLResponse;
  const user = json.data?.user;
  if (!user || json.errors?.length) throw new Error("GitHub GraphQL returned errors");

  const nodes = user.repositories.nodes;
  const bytes = new Map<string, number>();
  for (const r of nodes) {
    if (r.isFork) continue;
    for (const e of r.languages.edges) bytes.set(e.node.name, (bytes.get(e.node.name) ?? 0) + e.size);
  }
  const cal = user.contributionsCollection.contributionCalendar;

  return {
    publicRepos: user.allPublic.totalCount,
    ...summarize(
      nodes.map((r) => ({ fork: r.isFork, pushedAt: r.pushedAt, homepage: r.homepageUrl })),
      Date.now(),
    ),
    topLanguages: topShares(bytes),
    languageBasis: "bytes",
    contributions:
      cal.totalContributions > 0
        ? {
            total: cal.totalContributions,
            weeks: cal.weeks.map((w) => w.contributionDays.map((d) => d.contributionCount)),
          }
        : await publicCalendar(),
    fetchedAt: new Date().toISOString(),
    live: true,
  };
}

/* ---------- Public contribution calendar (the graph on the profile page) ---------- */

/**
 * Reads the public calendar at github.com/users/<login>/contributions. Used when the API has no
 * contribution data. Returns null rather than a misleading zero.
 */
async function publicCalendar(): Promise<GitHubStats["contributions"]> {
  try {
    const res = await fetch(`https://github.com/users/${profile.githubUser}/contributions`, {
      headers: { Accept: "text/html" },
      next: { revalidate: GITHUB_REVALIDATE },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const heading = /id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s+contribution/.exec(html);
    const total = heading?.[1] ? Number(heading[1].replace(/,/g, "")) : 0;
    if (!total) return null;

    // Cells are id="contribution-day-component-<weekday>-<week>"; tooltips carry the counts.
    const counts = new Map<string, number>();
    for (const m of html.matchAll(/for="(contribution-day-component-\d+-\d+)"[^>]*>\s*(\d+|No) contribution/g)) {
      counts.set(m[1]!, m[2] === "No" ? 0 : Number(m[2]));
    }
    const weeks: number[][] = [];
    for (const m of html.matchAll(/id="contribution-day-component-(\d+)-(\d+)"/g)) {
      const day = Number(m[1]);
      const week = Number(m[2]);
      (weeks[week] ??= [])[day] = counts.get(`contribution-day-component-${day}-${week}`) ?? 0;
    }
    return { total, weeks: weeks.filter(Boolean) };
  } catch {
    return null;
  }
}

/* ---------- Without a token: two public REST requests ---------- */

interface RestRepo {
  fork: boolean;
  language: string | null;
  homepage: string | null;
  pushed_at: string;
}

async function viaREST(): Promise<GitHubStats> {
  const headers = { Accept: "application/vnd.github+json" };
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${profile.githubUser}`, fetchOpts(headers)),
    fetch(`https://api.github.com/users/${profile.githubUser}/repos?per_page=100&sort=pushed`, fetchOpts(headers)),
  ]);
  if (!userRes.ok || !reposRes.ok) throw new Error(`GitHub REST ${userRes.status}/${reposRes.status}`);
  const user = (await userRes.json()) as { public_repos: number };
  const repos = (await reposRes.json()) as RestRepo[];

  // Per-repo byte counts would cost one request per repo, which the 60/hour anonymous limit can't afford.
  const counts = new Map<string, number>();
  for (const r of repos) if (!r.fork && r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);

  return {
    publicRepos: user.public_repos,
    ...summarize(
      repos.map((r) => ({ fork: r.fork, pushedAt: r.pushed_at, homepage: r.homepage })),
      Date.now(),
    ),
    topLanguages: topShares(counts),
    languageBasis: "repos",
    contributions: await publicCalendar(),
    fetchedAt: new Date().toISOString(),
    live: true,
  };
}

export async function getGitHubStats(): Promise<GitHubStats> {
  const token = process.env.GITHUB_TOKEN;
  try {
    return token ? await viaGraphQL(token) : await viaREST();
  } catch (err) {
    // During a background refresh in production, throwing keeps the last good page live
    // instead of replacing real numbers with the old snapshot.
    const isBuild = process.env.NEXT_PHASE === "phase-production-build";
    if (process.env.NODE_ENV === "production" && !isBuild) throw err;
    console.warn("[github] using snapshot:", err instanceof Error ? err.message : err);
    return FALLBACK;
  }
}
