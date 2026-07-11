import styles from "./Coffee.module.css";

const Coffee = () => {
  return (
    <a
      className={styles.Coffee}
      href="https://www.buymeacoffee.com/henbc13"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy Me a Coffee">
      <span className={styles.full}>buy me a&nbsp;</span>coffee
    </a>
  );
};

export default Coffee;
