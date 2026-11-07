import { site } from "@/data/site";
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
              {site.email ? (
                <>
                  <a className="btn btn-primary" href={`mailto:${site.email}`}>
                    Email me →
                  </a>
                  <a className="btn" href={site.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </>
              ) : (
                <a
                  className="btn btn-primary"
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Find me on GitHub →
                </a>
              )}
              {site.linkedin && (
                <a className="btn" href={site.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {site.resume && (
                <a className="btn" href={site.resume} target="_blank" rel="noopener noreferrer">
                  Résumé
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
