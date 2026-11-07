import Reveal from "./Reveal";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <Reveal>
          <div className={styles.box}>
            <span className="eyebrow">Contact</span>
            <h2 className={styles.title}>Got a role or a project in mind?</h2>
            <p className={styles.lede}>
              I&apos;d like to hear about it. Internships, dev roles, or just a good idea.
            </p>
            <div className={styles.actions}>
              <a
                className="btn btn-primary"
                href="https://github.com/ABowSEC"
                target="_blank"
                rel="noopener"
              >
                Find me on GitHub →
              </a>
              {/* TODO: add these once you have them
              <a className="btn" href="mailto:you@example.com">Email me</a>
              <a className="btn" href="https://www.linkedin.com/in/your-handle" target="_blank" rel="noopener">LinkedIn</a>
              <a className="btn" href="/resume.pdf">Résumé</a>
              */}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
