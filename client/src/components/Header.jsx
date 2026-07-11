import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.Header}>
      <p className={styles.eyebrow}>jremissing.com</p>
      <h1>
        JRE
        <br className={styles.br} />
        <span> Missing</span>
      </h1>
      <p className={styles.intro}>
        Automatically detects episodes of{" "}
        <a
          href="https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk"
          target="_blank"
          rel="noopener noreferrer">
          <span>The Joe Rogan Experience</span>
        </a>{" "}
        that are not available on Spotify, by comparing the official Spotify API with a
        database of every episode ever released. Also detects episodes shortened in duration.
      </p>
    </header>
  );
};

export default Header;
