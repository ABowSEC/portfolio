import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";
import styles from "./Work.module.css";

export default function Work() {
  const featured = projects.filter((p) => p.status !== "wip");
  const inProgress = projects.filter((p) => p.status === "wip");

  return (
    <section id="work" className="section">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Selected work</span>
            <h2>Built, shipped, still running.</h2>
            <p>One live site, one open-source tool, and a couple more on the way.</p>
          </div>
        </Reveal>

        <div className={styles.featured}>
          {featured.map((p) => (
            <Reveal key={p.slug}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h3 id="in-progress" className={styles.subhead}>
            In the works.
          </h3>
        </Reveal>
        <div className={styles.grid}>
          {inProgress.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
