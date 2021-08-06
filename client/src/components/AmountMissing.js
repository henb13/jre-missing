import styles from "./AmountMissing.module.css";
import getClientLocalTime from "../lib/getClientLocalTime";
import { ReactComponent as Checkmark } from "../icons/AmountMissingIcon.svg";

const AmountMissing = ({
  data,
  shakeEpisodes,
  episodesShown,
  setSearchText,
}) => {
  const now = Date.now();
  const lastChecked = data.lastChecked.miliseconds;
  const lastCheckedMinutes = Math.floor(
    (new Date(now) - new Date(lastChecked)) / 60000
  );

  const lastCheckedDate = getClientLocalTime(lastChecked, "PP HH:mm");
  const dateTime = getClientLocalTime(lastChecked, "yyyy-MM-dd HH:mm:ss.sss");
  return (
    <>
      <p className={styles.AmountMissing}>
        <span
          onClick={() =>
            episodesShown.length === data.missingEpisodes.length
              ? shakeEpisodes()
              : setSearchText("")
          }
        >
          {data.missingEpisodes.length}
        </span>{" "}
        episodes are missing from Spotify.
      </p>
      <div className={styles.LastChecked}>
        <p>
          Last checked: {lastCheckedMinutes} minute
          {lastCheckedMinutes != 1 && "s"} ago{" "}
          <time dateTime={dateTime}> ({lastCheckedDate})</time>
        </p>
        <Checkmark className={styles.Checkmark} />
      </div>
    </>
  );
};

export default AmountMissing;
