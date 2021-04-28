import GitHubLogo from "../icons/github-1.png";
import styles from "./Github.module.css";

const Github = () => {
  return (
    <>
      <a
        className={styles.Github}
        href="https://github.com/HenB13/jre-missing"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="view code on GitHub"
      >
        <img src={GitHubLogo} alt="github logo" className={styles.GithubLogo} />{" "}
      </a>
    </>
  );
};

export default Github;
