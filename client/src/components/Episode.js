import styles from "./Episode.module.css";
import { differenceInDays, parseISO } from "date-fns";
import getClientLocalTime from "../lib/getClientLocalTime";

// Days since removed to get labeled as "new"
const NEWLY_REMOVED_THRESHOLD = 14;

const Episode = ({ number, name, removedDate }) => {
    let [epNr, ...guest] = name.split("-");
    guest = guest.join("-");

    const isNewlyRemoved =
        differenceInDays(new Date(), parseISO(removedDate)) < NEWLY_REMOVED_THRESHOLD;

    return (
        <li className={styles.EpisodeItem} key={name} lang="en">
            {isNewlyRemoved && <span className={styles.new}>new</span>}
            {number ? (
                <>
                    <span className={styles.epNr}>{epNr.trim()}</span>
                    {guest.trim()}
                </>
            ) : (
                name.trim()
            )}
            {removedDate && <RemovedDetails removedDate={removedDate} />}
        </li>
    );
};

const RemovedDetails = ({ removedDate }) => {
    const dateTimeValue = getClientLocalTime(removedDate, "yyyy-MM-dd");
    const removedDateString = getClientLocalTime(removedDate, "PPP");
    return (
        <>
            <span className={styles.removed}>
                Removed on <time dateTime={dateTimeValue}>{removedDateString}</time>
            </span>
        </>
    );
};

export default Episode;
