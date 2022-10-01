import styles from "./Sponsor.module.css";

const Sponsor = () => {
  return (
    <iframe
      src="https://github.com/sponsors/henb13/button"
      title="Sponsor henb13"
      className={styles.githubSponsorButton}></iframe>
  );
};

export default Sponsor;
