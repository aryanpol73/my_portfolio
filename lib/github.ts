import { profile } from "@/data/portfolio";

export interface GitHubStats {
  publicRepos: number;
  originalRepos: number;
  activeRepos90d: number;
  liveDeployments: number;
  lastPush: string | null;
  topLanguages: { name: string; share: number }[];
  live: boolean;
}

interface RepoResponse {
  fork: boolean;
  language: string | null;
  homepage: string | null;
  pushed_at: string;
}

interface UserResponse {
  public_repos: number;
}

/** Snapshot from the November 2026 audit, used if the GitHub API is unreachable or rate-limited. */
const FALLBACK: GitHubStats = {
  publicRepos: 46,
  originalRepos: 36,
  activeRepos90d: 21,
  liveDeployments: 14,
  lastPush: null,
  topLanguages: [
    { name: "TypeScript", share: 0.45 },
    { name: "Python", share: 0.3 },
    { name: "JavaScript", share: 0.15 },
    { name: "HTML", share: 0.1 },
  ],
  live: false,
};

const DAY = 86_400_000;

export async function getGitHubStats(): Promise<GitHubStats> {
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const opts = { headers, next: { revalidate: 3600 } };

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${profile.githubUser}`, opts),
      fetch(`https://api.github.com/users/${profile.githubUser}/repos?per_page=100&sort=pushed`, opts),
    ]);
    if (!userRes.ok || !reposRes.ok) return FALLBACK;

    const user = (await userRes.json()) as UserResponse;
    const repos = (await reposRes.json()) as RepoResponse[];
    const original = repos.filter((r) => !r.fork);
    const now = Date.now();

    const langCounts = new Map<string, number>();
    for (const r of original) {
      if (r.language) langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1);
    }
    const langTotal = [...langCounts.values()].reduce((a, b) => a + b, 0) || 1;
    const topLanguages = [...langCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({ name, share: count / langTotal }));

    const lastPush = original.reduce<string | null>(
      (latest, r) => (!latest || r.pushed_at > latest ? r.pushed_at : latest),
      null,
    );

    return {
      publicRepos: user.public_repos,
      originalRepos: original.length,
      activeRepos90d: original.filter((r) => now - Date.parse(r.pushed_at) < 90 * DAY).length,
      liveDeployments: original.filter((r) => (r.homepage ?? "").trim().length > 0).length,
      lastPush,
      topLanguages,
      live: true,
    };
  } catch {
    return FALLBACK;
  }
}
