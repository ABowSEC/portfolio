import Reveal from "./Reveal";
import styles from "./About.module.css";

const tools = ["Python", "Flask", "Scapy", "scikit-learn", "JavaScript", "REST APIs", "TCP/IP", "Git"];

export default function About() {
  return (
    <section id="about" className={`section ${styles.about}`}>
      <div className={`container ${styles.grid}`}>
        <Reveal>
          <span className="eyebrow">About</span>
          <h2 className={styles.title}>Student by day. Packet sniffer by night.</h2>
        </Reveal>

        <Reveal delay={80}>
          <div className={styles.copy}>
            <p>
              I&apos;m Andrew, a computer science student who likes knowing how things actually
              work, especially once they hit the network. My projects usually start with a
              question, like what every device on my network is talking to, or when the next
              launch is and where to watch it.
            </p>
            <p>
              Right now I&apos;m splitting my time between a networked game for my Computer
              Networks class and a VR workspace for a research course. Next, I want an internship
              or developer role where I can work on real systems with people who know more than I
              do.
            </p>

            <h3 className={styles.toolsHead}>Things I use a lot</h3>
            <ul className={styles.tools}>
              {tools.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
