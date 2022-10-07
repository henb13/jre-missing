import styles from "./Episode.module.css";
import { differenceInDays, parseISO } from "date-fns";
import getClientLocalTime from "../lib/getClientLocalTime";

const NEWL_THRESHOLD = 14;

const Episode = ({ number, name, variant, dateInMs }) => {
  // eslint-disable-next-line no-unused-vars
  let [_, ...guest] = name.split("-");
  guest = guest.join("-");
  const isNew =
    dateInMs && differenceInDays(new Date(), parseISO(new Date(dateInMs))) < NEWL_THRESHOLD;

  return (
    <li className={styles.EpisodeItem} key={name} lang="en">
      {isNew && <span className={styles.new}>new</span>}
      {number ? (
        <>
          <span className={styles.epNumber}>#{number}</span>
          {guest}
        </>
      ) : (
        name
      )}
      {dateInMs && (
        <span className={styles.timeDetail}>
          {variant === "removed" ? "Removed" : "Shortened"} on <Time date={dateInMs} />
        </span>
      )}
    </li>
  );
};

const Time = ({ date }) => {
  const dateTimeValue = dateTimeHTMLAttribute(date);
  const dateString = getDateString(date);
  return <time dateTime={dateTimeValue}>{dateString}</time>;
};

const getDateString = (time) => {
  return getClientLocalTime(time, "PPP");
};
const dateTimeHTMLAttribute = (time) => {
  return getClientLocalTime(time, "yyyy-MM-dd");
};

export default Episode;
