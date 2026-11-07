import Year from "./Year";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.brand}>abowsec_</span>
        <span>
          © <Year /> Andrew Bowman
        </span>
        <a href="https://github.com/ABowSEC" target="_blank" rel="noopener">
          GitHub
        </a>
      </div>
    </footer>
  );
}
