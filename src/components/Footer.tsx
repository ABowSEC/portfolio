import { site } from "@/data/site";
import Year from "./Year";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.brand}>abowsec_</span>
        <span>
          © <Year /> {site.name}
        </span>
        <a href={site.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </footer>
  );
}
