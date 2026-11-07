"use client";

import { useActivity, useHydrated } from "@/lib/activity-store";
import { GITHUB_USER, shortDate, timeAgo, type Commit } from "@/lib/github";
import styles from "./Now.module.css";

export default function ActivityFeed({ snapshot }: { snapshot: Commit[] }) {
  const commits = useActivity(snapshot).slice(0, 6);
  const hydrated = useHydrated();

  if (commits.length === 0) {
    return (
      <p className={styles.empty}>
        GitHub isn&apos;t answering right now.{" "}
        <a className="arrow-link" href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noopener noreferrer">
          See my activity there →
        </a>
      </p>
    );
  }

  return (
    <ol className={styles.feed}>
      {commits.map((c) => (
        <li key={c.repo + c.sha}>
          <div className={styles.feedMeta}>
            <a href={`#${c.slug}`} className={styles.project}>
              {c.title}
            </a>
            <time dateTime={c.date} title={new Date(c.date).toUTCString()}>
              {hydrated ? timeAgo(c.date) : shortDate(c.date)}
            </time>
          </div>
          <a className={styles.commit} href={c.url} target="_blank" rel="noopener noreferrer">
            <span className={styles.sha}>{c.sha}</span> {c.message}
          </a>
        </li>
      ))}
    </ol>
  );
}
