import Image from "next/image";
import { me } from "@/data/me";
import CollapsibleSection from "./CollapsibleSection";
import Reveal from "./Reveal";
import styles from "./About.module.css";

const tools = [
  "Python",
  "Scapy",
  "Flask",
  "TypeScript",
  "React",
  "Next.js",
  "Three.js",
  "Cloudflare Workers",
  "Rust → WASM",
  "SQL",
  "SQLite",
  "Boomi",
  "C++",
  "TCP/IP",
  "Git",
];

export default function About() {
  const facts = [
    me.degree,
    me.school && `${me.school}${me.gradYear ? `, class of ${me.gradYear}` : ""}`,
    me.location && `${me.location} · ${me.timezoneLabel}`,
  ].filter(Boolean);

  return (
    <CollapsibleSection
      id="about"
      eyebrow="About"
      title="Student by day. Packet sniffer by night."
      summary={`${me.experience[0] ? `${me.experience[0].title} at ${me.schoolShort} · ` : ""}how a cook and EMT ended up in systems integration.`}
      className={styles.about}
    >
      <div className={styles.grid}>
        <Reveal>
          {me.photo && (
            <Image
              src={me.photo}
              alt={`Photo of Andrew Bowman`}
              width={600}
              height={600}
              className={styles.photo}
            />
          )}
          <ul className={styles.facts}>
            {facts.map((f) => (
              <li key={f as string}>{f}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80}>
          <div className={styles.copy}>
            {me.story && <p className={styles.story}>{me.story}</p>}
            <p>
              I&apos;m Andrew, a computer science student who likes knowing how things actually
              work, especially once they hit the network. My projects usually start with a
              question, like what every device on my network is talking to, or when the next
              launch is and where to watch it.
            </p>
            <p>
              Right now I&apos;m interning with CSU&apos;s Student Information Systems team, building a
              networked game for my Computer Networks class, and running a WebXR user study for a
              research course. I graduate in December 2027, and I want a role where I can work on real
              systems with people who know more than I do.
            </p>

            {me.experience.length > 0 && (
              <>
                <h3 className={styles.toolsHead}>Experience</h3>
                {me.experience.map((r) => (
                  <article key={r.title + r.org} className={styles.role}>
                    <div className={styles.roleHead}>
                      <h4>
                        {r.title} <span>· {r.org}</span>
                      </h4>
                      <span className={styles.roleDates}>
                        {r.start} – {r.end ?? "present"}
                      </span>
                    </div>
                    <p className={styles.roleMeta}>
                      {r.team ? `${r.team} · ` : ""}
                      {r.location}
                    </p>
                    <ul>
                      {r.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </>
            )}

            <h3 className={styles.toolsHead}>Things I use a lot</h3>
            <ul className={styles.tools}>
              {tools.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
            {me.certifications.length > 0 && (
              <p className={styles.certs}>
                {me.certifications.map((c) => `${c.name} · ${c.issuer}, ${c.date}`).join("  /  ")}
              </p>
            )}

            {me.timeline.length > 0 && (
              <>
                <h3 className={styles.toolsHead}>How I got here</h3>
                <ol className={styles.timeline}>
                  {me.timeline.map((t) => (
                    <li key={t.when + t.text} className={t.next ? styles.next : undefined}>
                      <span className={styles.when}>{t.when}</span>
                      <span>{t.text}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {me.interests.length > 0 && (
              <>
                <h3 className={styles.toolsHead}>Away from the keyboard</h3>
                <ul className={styles.tools}>
                  {me.interests.map((t) => (
                    <li key={t} className="tag">
                      {t}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </CollapsibleSection>
  );
}
