import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <svg className={styles.orbits} viewBox="0 0 600 600" aria-hidden="true">
        <circle cx="300" cy="300" r="120" />
        <circle cx="300" cy="300" r="200" />
        <circle cx="300" cy="300" r="280" />
        <g className={styles.spin}>
          <circle className={styles.body} cx="300" cy="100" r="7" />
        </g>
        <g className={styles.spinSlow}>
          <circle className={styles.body} cx="580" cy="300" r="5" />
        </g>
      </svg>

      <div className={`container ${styles.inner}`}>
        <span className="eyebrow">Andrew Bowman · CS student</span>
        <h1 className={styles.title}>
          I build tools that watch networks and track rockets.
        </h1>
        <p className={styles.lede}>
          Mostly networking and security, with web apps and a bit of machine learning along the
          way. Currently looking for internships and developer roles.
        </p>
        <div className={styles.actions}>
          <a className="btn btn-primary" href="#work">
            See my work →
          </a>
          <a className="btn" href="https://github.com/ABowSEC" target="_blank" rel="noopener">
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
