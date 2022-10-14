import styles from "./Episode.module.css";

const Episode = ({ variant, name, number, date, isNew }) => {
  // eslint-disable-next-line no-unused-vars
  let [_, ...guest] = name.split("-");
  guest = guest.join("-");

  return (
    <div className={styles.epContent}>
      {isNew && <span className={styles.new}>new</span>}
      <div className={styles.epName}>
        {number ? (
          <>
            <span className={styles.epNumber}>#{number}</span>
            <span className={styles.epGuest}>{guest}</span>
          </>
        ) : (
          name
        )}
      </div>
      {date && (
        <span className={styles.timeDetail}>
          {variant === "removed" ? "Removed" : "Shortened"} on{" "}
          <time dateTime={date.htmlAttribute}>{date.formatted}</time>
        </span>
      )}
    </div>
  );
};

export default Episode;
