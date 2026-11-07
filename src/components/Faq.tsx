import { faq } from "@/data/faq";
import Reveal from "./Reveal";
import styles from "./Faq.module.css";

export default function Faq() {
  return (
    <section id="faq" className="section">
      <div className={`container ${styles.grid}`}>
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">FAQ</span>
            <h2>Quick answers.</h2>
            <p>The things people usually ask first.</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className={styles.list}>
            {faq.map((item) => (
              <details key={item.q} className={styles.item}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
