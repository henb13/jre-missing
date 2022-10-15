import styles from "./Coffee.module.css";

const Coffee = () => {
  return (
    <>
      <a
        className={styles.Coffee}
        href="https://www.buymeacoffee.com/henbc13"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Buy Me a Coffee">
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me a Coffee logo"
          className={styles.CoffeeLogo}
        />
      </a>
    </>
  );
};

export default Coffee;
