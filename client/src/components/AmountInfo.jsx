import classnames from "classnames";
import styles from "./AmountInfo.module.css";
import { getClientLocalTime, formatMinutesToTimeAmountString } from "../utils";
import Checkmark from "../icons/AmountInfoIcon.svg";
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
      <button onClick={() => setListShown("removed")} className={styles.AmountInfoItem}>
        <span
          className={classnames(styles.count, {
            [styles.NoAmount]: missingEpisodes.length === 0,
          })}>
          {missingEpisodes.length}
        </span>{" "}
        episodes are missing from Spotify.
      </button>
      <button onClick={() => setListShown("shortened")} className={styles.AmountInfoItem}>
        <span
          className={classnames(styles.count, {
            [styles.NoAmount]: shortenedEpisodes.length === 0,
          })}>
          {shortenedEpisodes.length}
        </span>{" "}
        episode
        {shortenedEpisodes.length === 1 ? "" : "s"}{" "}
        {shortenedEpisodes.length == 1 ? "has" : "have"} been shortened.
      </button>
      <div className={styles.LastChecked}>
        <p>
          Last checked: {lastCheckedString} ago
          <time dateTime={dateTimeHTMLAttribute}> ({lastCheckedDate})</time>
        </p>
        <Checkmark className={styles.Checkmark} />
      </div>
    </div>
  );
};

export default AmountInfo;
