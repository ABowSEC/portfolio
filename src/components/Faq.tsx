import { faq } from "@/data/faq";
import CollapsibleSection from "./CollapsibleSection";
import Reveal from "./Reveal";
import styles from "./Faq.module.css";

export default function Faq() {
  return (
    <CollapsibleSection id="faq" eyebrow="FAQ" title="Quick answers." summary="The things people usually ask first.">
      <Reveal>
          <div className={styles.list}>
            {faq.map((item) => (
              <details key={item.q} className={styles.item}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
      </Reveal>
    </CollapsibleSection>
  );
}
