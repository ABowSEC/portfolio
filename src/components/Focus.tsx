import Reveal from "./Reveal";
import styles from "./Focus.module.css";

const areas = [
  {
    label: "01 / networks",
    title: "Networking & security",
    body: "Packet capture, traffic analysis and protocol design. Tools that see what's happening on a network without getting in the way.",
    href: "#netsleuth",
    link: "NetSleuth",
  },
  {
    label: "02 / web",
    title: "Web apps & APIs",
    body: "Pulling data from several sources and making it easy to read. Ephemeris tracks every upcoming launch with live countdowns and alerts.",
    href: "#ephemeris",
    link: "Ephemeris",
  },
  {
    label: "03 / research",
    title: "ML & research",
    body: "Training a model on real network traffic to catch anomalies, and building a VR workspace for a research course.",
    href: "#in-progress",
    link: "In progress",
  },
];

export default function Focus() {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">What I do</span>
            <h2>Less theory. More running code.</h2>
            <p>Three areas I keep coming back to, each with a project behind it.</p>
          </div>
        </Reveal>

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
      </div>
    </section>
  );
}
