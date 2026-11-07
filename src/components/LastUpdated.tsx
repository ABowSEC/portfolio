"use client";

import { useActivity, useHydrated } from "@/lib/activity-store";
import { latestFor, shortDate, timeAgo, type Commit } from "@/lib/github";

export default function LastUpdated({ slug, snapshot, className }: { slug: string; snapshot: Commit[]; className?: string }) {
  const latest = latestFor(useActivity(snapshot), slug);
  const hydrated = useHydrated();
  if (!latest) return null;
  return (
    <a className={className} href={latest.url} target="_blank" rel="noopener noreferrer" title={latest.message}>
      updated {hydrated ? timeAgo(latest.date) : shortDate(latest.date)}
    </a>
  );
}
