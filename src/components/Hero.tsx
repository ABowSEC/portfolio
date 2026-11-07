import { me } from "@/data/me";
import { site } from "@/data/site";
import { getActivitySnapshot } from "@/lib/activity-snapshot";
import Greeting from "./Greeting";
import HeroArt from "./HeroArt";
import styles from "./Hero.module.css";

export default async function Hero() {
  const snapshot = await getActivitySnapshot();

  return (
    <section id="top" className={styles.hero}>
      <HeroArt />

      <div className={`container ${styles.inner}`}>
        <p className={styles.name}>{site.name}</p>
        <span className={`eyebrow ${styles.meta}`}>
          CS student{me.schoolShort ? ` at ${me.schoolShort}` : ""}
          {me.gradYear ? ` · Class of ${me.gradYear}` : ""}
        </span>
        <h1 className={styles.title}>
          I make complicated systems talk to each other, <em>simply.</em>
        </h1>
        <p className={styles.lede}>
          On CSU&apos;s Student Information Systems team I connect student-service platforms to
          campus databases. On my own time I build network tools and web apps like NetSleuth and
          Ephemeris. Graduating December 2027 and looking for internships and developer roles.
        </p>
        <div className={styles.actions}>
          <a className="btn btn-primary" href="#work">
            See my work →
          </a>
          <a className="btn" href={site.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          {site.resume && (
            <a className="btn" href={site.resume} target="_blank" rel="noopener noreferrer">
              Résumé
            </a>
          )}
        </div>
        <Greeting snapshot={snapshot} />
        <p className={styles.hint}>
          psst: press <kbd>`</kbd> for a shell
        </p>
      </div>
    </section>
  );
}
