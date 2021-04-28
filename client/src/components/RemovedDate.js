import getClientLocalTime from "../lib/getClientLocalTime";
import { differenceInDays, parseISO } from "date-fns";
import styles from "./RemovedDate.module.css";

const RemovedDate = ({ removedDate }) => {
  return (
    <span className={styles.newRemoved}>
      {differenceInDays(new Date(), parseISO(removedDate)) < 7 && (
        <span className={styles.new}>new</span>
      )}
      <span className={styles.removed}>
        date removed:{" "}
        <time dateTime={getClientLocalTime(removedDate, "yyyy-MM-dd")}>
          {" "}
          {getClientLocalTime(removedDate, "PPP")}
        </time>
      </span>
    </span>
  );
};

export default RemovedDate;
