import Image from "next/image";
import type { Project } from "@/data/projects";
import type { Commit } from "@/lib/github";
import LastUpdated from "./LastUpdated";
import TerminalPanel from "./TerminalPanel";
import ProtocolInspector from "./ProtocolInspector";
import styles from "./ProjectCard.module.css";

// Screenshots and mock panels sit on a warm "mat" as a window, rather than
// filling the card edge to edge, so dark UIs read as objects on the page.
function Showcase({ p }: { p: Project }) {
  const href = p.links[0]?.href;
  const host = href ? new URL(href).host.replace(/^www\./, "") : "";

  const windowed = p.image ? (
    <div className={styles.window}>
      <div className={styles.chrome} aria-hidden="true">
        <span />
        <span />
        <span />
        {host && <span className={styles.url}>{host}</span>}
      </div>
      <Image
        src={p.image}
        alt={`Screenshot of ${p.title}`}
        width={1440}
        height={900}
        sizes="(max-width: 860px) 110vw, 760px"
        className={styles.shot}
      />
    </div>
  ) : (
    <div className={`${styles.window} ${styles.windowTerm}`}>
      <TerminalPanel />
    </div>
  );

  // Live sites are clickable; everything else is just a picture.
  return p.status === "live" && href ? (
    <a className={styles.stage} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.title} (${host})`}>
      {windowed}
    </a>
  ) : (
    <div className={styles.stage}>{windowed}</div>
  );
}

export default function ProjectCard({ project: p, activity = [] }: { project: Project; activity?: Commit[] }) {
  const large = p.status !== "wip" || p.demo !== undefined;

  return (
    <article id={p.slug} className={`${styles.card} ${large ? styles.large : ""}`}>
      {large && (
        <div className={styles.media}>
          {p.demo === "protocol-inspector" ? <ProtocolInspector /> : <Showcase p={p} />}
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className="tag">{p.category}</span>
          {p.status === "live" && <span className={styles.live}>● Live</span>}
          {p.course && <span className={styles.course}>{p.course}</span>}
          {p.repo && <LastUpdated slug={p.slug} snapshot={activity} className={styles.updated} />}
        </div>

        <h3>{p.title}</h3>
        <p>{p.summary}</p>

        {p.highlight && (
          <p className={styles.highlight}>
            <span className={styles.highlightLabel}>Highlight</span>
            {p.highlight}
          </p>
        )}

        <ul className={styles.stack}>
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        {p.links.length > 0 && (
          <div className={styles.links}>
            {p.links.map((l) => (
              <a key={l.href} className="arrow-link" href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label} →
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
