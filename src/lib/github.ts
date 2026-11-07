import { projects } from "@/data/projects";

export const GITHUB_USER = "ABowSEC";

export type Commit = {
  slug: string;
  title: string;
  repo: string;
  sha: string;
  message: string;
  date: string; // ISO
  url: string;
};

type GhCommit = {
  sha: string;
  html_url: string;
  commit: { message: string; author?: { date?: string }; committer?: { date?: string } };
};

const tracked = projects.flatMap((p) => (p.repo ? [{ slug: p.slug, title: p.title, repo: p.repo }] : []));

/** Latest commits across every project that has a `repo`, newest first. Runs on server or client. */
export async function fetchActivity(init: { headers?: HeadersInit; signal?: AbortSignal } = {}): Promise<Commit[]> {
  const perRepo = await Promise.all(
    tracked.map(async (t) => {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${t.repo}/commits?per_page=4`, {
        headers: { Accept: "application/vnd.github+json", ...init.headers },
        signal: init.signal,
      });
      if (!res.ok) throw new Error(`GitHub ${res.status} for ${t.repo}`);
      const data = (await res.json()) as GhCommit[];
      return data.map((c) => ({
        slug: t.slug,
        title: t.title,
        repo: t.repo,
        sha: c.sha.slice(0, 7),
        message: c.commit.message.split("\n")[0],
        date: c.commit.author?.date ?? c.commit.committer?.date ?? "",
        url: c.html_url,
      }));
    })
  );
  return perRepo.flat().sort((a, b) => b.date.localeCompare(a.date));
}

export function latestFor(commits: Commit[], slug: string): Commit | undefined {
  return commits.find((c) => c.slug === slug);
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 86400],
  ["month", 30 * 86400],
  ["week", 7 * 86400],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

export function timeAgo(iso: string, now = Date.now()): string {
  const seconds = (new Date(iso).getTime() - now) / 1000;
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

/** Same output on server and client (fixed time zone), so it's safe to pre-render. */
export function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}
