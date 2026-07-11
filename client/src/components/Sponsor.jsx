import styles from "./Sponsor.module.css";

const Sponsor = () => {
  return (
    <a
      className={styles.Sponsor}
      href="https://github.com/sponsors/henb13"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Sponsor henb13 on GitHub">
      <span className={styles.heart} aria-hidden="true">
        ♥
      </span>
      sponsor
    </a>
  );
};

export default Sponsor;
