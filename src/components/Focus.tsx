import CollapsibleSection from "./CollapsibleSection";
import Reveal from "./Reveal";
import styles from "./Focus.module.css";

const areas = [
  {
    label: "01 / integrations",
    title: "Systems integration",
    body: "Connecting student-service platforms to campus databases at CSU, with Boomi workflows and data connections that keep information moving between programs.",
    href: "#about",
    link: "Experience",
  },
  {
    label: "02 / networks",
    title: "Networking & security",
    body: "Packet capture, traffic analysis and protocol design. Tools that see what's happening on a network without getting in the way.",
    href: "#netsleuth",
    link: "NetSleuth",
  },
  {
    label: "03 / web",
    title: "Web apps & APIs",
    body: "Pulling live data from several sources and keeping it fast. Ephemeris tracks every upcoming launch, cached at the edge so it stays inside strict API limits.",
    href: "#ephemeris",
    link: "Ephemeris",
  },
  {
    label: "04 / research",
    title: "Research & ML",
    body: "Running a WebXR user study that compares desktop and VR workspaces, and working toward an anomaly-detection model for NetSleuth trained on real traffic.",
    href: "#in-progress",
    link: "In progress",
  },
];

export default function Focus() {
  return (
    <CollapsibleSection
      id="focus"
      eyebrow="What I do"
      title={
        <>
          Your integrations, <em className={styles.accent}>simplified.</em>
        </>
      }
      summary="Campus systems, a home network or a dozen launch APIs: the job is the same. Get data moving cleanly between things, then make it easy to see."
    >
        <div className={styles.grid}>
          {areas.map((a, i) => (
            <Reveal key={a.title} delay={i * 80}>
              <a className={styles.card} href={a.href}>
                <span className={styles.label}>{a.label}</span>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
                <span className="arrow-link">{a.link} →</span>
              </a>
            </Reveal>
          ))}
        </div>
    </CollapsibleSection>
  );
}
