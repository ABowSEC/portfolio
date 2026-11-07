import { projects } from "@/data/projects";
import { getActivitySnapshot } from "@/lib/activity-snapshot";
import CollapsibleSection from "./CollapsibleSection";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";
import styles from "./Work.module.css";

export default async function Work() {
  const snapshot = await getActivitySnapshot();
  const featured = projects.filter((p) => p.status !== "wip");
  const inProgress = projects.filter((p) => p.status === "wip");

  return (
    <CollapsibleSection
      id="work"
      eyebrow="Selected work"
      title="Built, shipped, still running."
      summary="One live site, one open-source tool, and a couple more on the way."
      defaultOpen
    >
        <div className={styles.featured}>
          {featured.map((p) => (
            <Reveal key={p.slug}>
              <ProjectCard project={p} activity={snapshot} />
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
              <ProjectCard project={p} activity={snapshot} />
            </Reveal>
          ))}
        </div>
    </CollapsibleSection>
  );
}
