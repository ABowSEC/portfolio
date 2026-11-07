"use client";

import type { CSSProperties } from "react";
import { useSectionProgress } from "@/lib/useSectionProgress";
import styles from "./TraceRail.module.css";

const HOPS = ["top", "focus", "work", "now", "about", "faq", "contact"] as const;

// A traceroute down the page: each section is a hop, the packet follows your
// scroll, and each hop shows how long after page load you first reached it.
export default function TraceRail() {
  const { index, position, reachedAt } = useSectionProgress(HOPS, true);

  return (
    <nav className={styles.rail} aria-label="Page trace" style={{ "--p": position } as CSSProperties}>
      <div className={styles.track}>
        <span className={styles.travelled} aria-hidden="true" />
        <span className={styles.packet} aria-hidden="true" />
        <ol className={styles.list}>
        {HOPS.map((id, i) => {
          const t = reachedAt[i];
          const state = i === index ? styles.current : t !== undefined ? styles.reached : "";
          return (
            <li key={id} className={state}>
              <a href={`#${id}`} aria-current={i === index ? "location" : undefined}>
                <span className={styles.num}>{i + 1}</span>
                <span className={styles.dot} />
                <span className={styles.label}>
                  {id}
                  <span className={styles.time}>{t !== undefined ? `${(t / 1000).toFixed(1)} s` : "*"}</span>
                </span>
              </a>
            </li>
          );
        })}
        </ol>
      </div>
    </nav>
  );
}
