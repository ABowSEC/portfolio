import { cache } from "react";
import { fetchActivity, type Commit } from "./github";

// Server-side: fetched once per `next build` and baked into the HTML.
// In `next dev` it would run on every request, so keep it in memory for a while
// to stay well under GitHub's 60 requests/hour unauthenticated limit.
let memo: { at: number; data: Commit[] } | null = null;
const DEV_TTL = 10 * 60_000;

export const getActivitySnapshot = cache(async (): Promise<Commit[]> => {
  if (memo && Date.now() - memo.at < DEV_TTL) return memo.data;
  try {
    const token = process.env.GITHUB_TOKEN; // optional, raises the build's rate limit
    const data = await fetchActivity({ headers: token ? { Authorization: `Bearer ${token}` } : undefined });
    memo = { at: Date.now(), data };
    return data;
  } catch (err) {
    console.warn(`[activity] GitHub snapshot unavailable: ${(err as Error).message}`);
    return memo?.data ?? [];
  }
});
