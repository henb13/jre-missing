import styles from "./AmountInfo.module.css";
import { getClientLocalTime, formatMinutesToTimeAmountString } from "../utils";
import { ReactComponent as Checkmark } from "../icons/AmountInfoIcon.svg";
import SkeletonText from "../skeletons/SkeletonText";

const AmountInfo = ({ data, showSkeleton }) => {
  if (showSkeleton) return <SkeletonText />;
  if (!data) return null;

  const lastChecked = data.lastChecked?.miliseconds;
  const lastCheckedMinutes = lastChecked
    ? Math.floor((new Date() - new Date(lastChecked)) / 60000)
    : 0;

  const lastCheckedString = formatMinutesToTimeAmountString(lastCheckedMinutes);
  const lastCheckedDate = getClientLocalTime(lastChecked, "PP HH:mm");

  const dateTimeHTMLAttribute = getClientLocalTime(lastChecked, "yyyy-MM-dd HH:mm:ss.sss");

  return (
    <div className={styles.AmountInfo}>
      <p className={styles.AmountInfoItem}>
        <span>{data.missingEpisodes?.length}</span> episodes are missing from Spotify.
      </p>
      <p className={styles.AmountInfoItem}>
        <span>{data.shortenedEpisodes?.length}</span> live Spotify episode
        {data.shortenedEpisodes?.length === 1 ? "" : "s"}{" "}
        {data.shortenedEpisodes?.length == 1 ? "has" : "have"} been shortened.
      </p>
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
