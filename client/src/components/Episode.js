import styles from "./Episode.module.css";
import { differenceInDays, parseISO } from "date-fns";
import { getDateString, getDateTimeHTMLAttribute } from "../utils";

const NEWL_THRESHOLD = 14;

const Episode = ({ number, name, variant, dateInMs }) => {
  // eslint-disable-next-line no-unused-vars
  let [_, ...guest] = name.split("-");
  guest = guest.join("-");
  const isNew =
    dateInMs && differenceInDays(new Date(), parseISO(new Date(dateInMs))) < NEWL_THRESHOLD;

  return (
    <div className={styles.epContent}>
      {isNew && <span className={styles.new}>new</span>}
      <div>
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
