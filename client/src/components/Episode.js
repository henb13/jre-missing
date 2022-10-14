import styles from "./Episode.module.css";

import { getDateString, getDateTimeHTMLAttribute } from "../utils";

const Episode = ({ number, name, variant, dateInMs, isNew }) => {
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
      {dateInMs && (
        <span className={styles.timeDetail}>
          {variant === "removed" ? "Removed" : "Shortened"} on <Time date={dateInMs} />
        </span>
      )}
    </div>
  );
};

const Time = ({ date }) => {
  const dateTimeValue = getDateTimeHTMLAttribute(date);
  const dateString = getDateString(date);

  return <time dateTime={dateTimeValue}>{dateString}</time>;
};

export default Episode;
