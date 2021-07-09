import getClientLocalTime from "../lib/getClientLocalTime";
import { differenceInDays, parseISO } from "date-fns";
import styles from "./EpisodeDetails.module.css";

const EpisodeDetails = ({ removedDate }) => {
  const isNewlyRemoved =
    differenceInDays(new Date(), parseISO(removedDate)) < 7;
  const dateTimeValue = getClientLocalTime(removedDate, "yyyy-MM-dd");
  const removedDateString = getClientLocalTime(removedDate, "PPP");

  return (
    <>
      {isNewlyRemoved && <span className={styles.new}>new</span>}
      <span className={styles.removed}>
        date removed: <time dateTime={dateTimeValue}>{removedDateString}</time>
      </span>
    </>
  );
};

export default EpisodeDetails;
