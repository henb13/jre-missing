import styles from "./AmountMissing.module.css";
import getClientLocalTime from "../lib/getClientLocalTime";
import formatMinutesToTimeString from "../lib/formatMinutesToTimeString";
import { ReactComponent as Checkmark } from "../icons/AmountMissingIcon.svg";
import SkeletonText from "../skeletons/SkeletonText";

const AmountMissing = ({ data, showSkeleton }) => {
    if (showSkeleton) {
        return <SkeletonText />;
    }

    if (!data) {
        return null;
    }

    const now = Date.now();
    const lastChecked = data.lastChecked?.miliseconds;
    const lastCheckedMinutes = lastChecked
        ? Math.floor((new Date(now) - new Date(lastChecked)) / 60000)
        : 0;

    const lastCheckedString = formatMinutesToTimeString(lastCheckedMinutes);
    const lastCheckedDate = getClientLocalTime(lastChecked, "PP HH:mm");

    const dateTime = getClientLocalTime(lastChecked, "yyyy-MM-dd HH:mm:ss.sss");

    return (
        <>
            <p className={styles.AmountMissing}>
                <span>{data.missingEpisodes?.length}</span> episodes are missing from Spotify.
            </p>
            <div className={styles.LastChecked}>
                <p>
                    Last checked: {lastCheckedString}{" "}
                    <time dateTime={dateTime}> ({lastCheckedDate})</time>
                </p>
                <Checkmark className={styles.Checkmark} />
            </div>
        </>
    );
};

export default AmountMissing;
