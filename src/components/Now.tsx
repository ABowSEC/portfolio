import { me } from "@/data/me";
import { getActivitySnapshot } from "@/lib/activity-snapshot";
import ActivityFeed from "./ActivityFeed";
import CollapsibleSection from "./CollapsibleSection";
import Reveal from "./Reveal";
import styles from "./Now.module.css";

export default async function Now() {
  const snapshot = await getActivitySnapshot();
  const items = me.now.filter((i) => i.text);
  const updated = new Date(`${me.nowUpdated}-01T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <CollapsibleSection
      id="now"
      eyebrow="Now"
      title="What has my attention."
      summary="What I'm working on at the moment, and the commits that back it up."
    >
        <div className={styles.grid}>
          {items.length > 0 && (
            <Reveal>
              <div className={styles.panel}>
                <h3 className={styles.panelHead}>
                  now <span>updated {updated}</span>
                </h3>
                <ul className={styles.now}>
                  {items.map((i) => (
                    <li key={i.label}>
                      <span className={styles.label}>{i.label}</span>
                      {i.href ? <a href={i.href}>{i.text}</a> : <span>{i.text}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          <Reveal delay={80}>
            <div className={styles.panel}>
              <h3 className={styles.panelHead}>
                recent commits <span className={styles.live}>● live from GitHub</span>
              </h3>
              <ActivityFeed snapshot={snapshot} />
            </div>
          </Reveal>
        </div>
    </CollapsibleSection>
  );
}
