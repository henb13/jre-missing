import classnames from "classnames";
import styles from "./AmountInfo.module.css";
import { getClientLocalTime, formatMinutesToTimeAmountString } from "../utils";
import SkeletonText from "../skeletons/SkeletonText.jsx";

const AmountInfo = ({ data, showSkeleton, setListShown }) => {
  if (showSkeleton) return <SkeletonText />;
  if (!data || !data.missingEpisodes || !data.shortenedEpisodes) return null;

  const { missingEpisodes, shortenedEpisodes } = data;

  const lastChecked = data.lastCheckedInMs;
  const lastCheckedMinutes = lastChecked
    ? Math.floor((new Date() - new Date(lastChecked)) / 60000)
    : 0;

  const lastCheckedString = formatMinutesToTimeAmountString(lastCheckedMinutes);
  const lastCheckedDate = getClientLocalTime(lastChecked, "PP HH:mm");

  const dateTimeHTMLAttribute = getClientLocalTime(lastChecked, "yyyy-MM-dd HH:mm:ss.sss");

  return (
    <div className={styles.AmountInfo}>
      <div className={styles.stats}>
        <button onClick={() => setListShown("removed")} className={styles.stat}>
          <span
            className={classnames(styles.count, {
              [styles.NoAmount]: missingEpisodes.length === 0,
            })}>
            {missingEpisodes.length}
          </span>
          <span className={styles.statLabel}>
            episode{missingEpisodes.length === 1 ? "" : "s"} removed
          </span>
        </button>
        <button onClick={() => setListShown("shortened")} className={styles.stat}>
          <span
            className={classnames(styles.count, {
              [styles.NoAmount]: shortenedEpisodes.length === 0,
            })}>
            {shortenedEpisodes.length}
          </span>
          <span className={styles.statLabel}>
            episode{shortenedEpisodes.length === 1 ? "" : "s"} shortened
          </span>
        </button>
      </div>
      <div className={styles.LastChecked}>
        <span className={styles.dot} aria-hidden="true"></span>
        <p>
          last checked {lastCheckedString} ago
          <time dateTime={dateTimeHTMLAttribute}> — {lastCheckedDate}</time>
        </p>
      </div>
    </div>
  );
};

export default AmountInfo;
