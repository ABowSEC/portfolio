import Image from "next/image";
import type { Project } from "@/data/projects";
import TerminalPanel from "./TerminalPanel";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project: p }: { project: Project }) {
  const large = p.status !== "wip";

  return (
    <article id={p.slug} className={`${styles.card} ${large ? styles.large : ""}`}>
      {large && (
        <div className={styles.media}>
          {p.image ? (
            <Image
              src={p.image}
              alt={`Screenshot of ${p.title}`}
              width={1440}
              height={900}
              className={styles.shot}
            />
          ) : (
            <TerminalPanel />
          )}
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className="tag">{p.category}</span>
          {p.status === "live" && <span className={styles.live}>● Live</span>}
          {p.course && <span className={styles.course}>{p.course}</span>}
        </div>

        <h3>{p.title}</h3>
        <p>{p.summary}</p>

        <ul className={styles.stack}>
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        {p.links.length > 0 && (
          <div className={styles.links}>
            {p.links.map((l) => (
              <a key={l.href} className="arrow-link" href={l.href} target="_blank" rel="noopener">
                {l.label} →
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
