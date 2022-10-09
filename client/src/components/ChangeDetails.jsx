import { useState } from "react";
import Disclosure from "./Disclosure";
import styles from "./ChangeDetails.module.css";
import { getDateString, formatMsToTimeString } from "../utils";

const ChangeDetails = ({ episode }) => {
  const [open, setOpen] = useState(false);
  const id = `${episode.full_name}-change-history`;

  const [latestChange, ...restOfChanges] = episode.changes;

  return (
    <div className={styles.ChangeDetails}>
      <div className={styles.ChangeDisplay}>
        <p>
          <span className={styles.displayTime}>
            {formatMsToTimeString(latestChange.old_duration)}
          </span>
        </p>
        <span>&gt;</span>
        <p>
          <span className={styles.displayTime}>
            {formatMsToTimeString(latestChange.new_duration)}
          </span>
        </p>
      </div>
      {restOfChanges.length > 0 && (
        <div className={styles.restOfChanges}>
          <Disclosure
            isOpen={open}
            onClick={() => {
              setOpen((open) => !open);
            }}
            className={styles.historyToggle}
            ariaControls={id}>
            <span className={styles.heading}>
              Has been changed {restOfChanges.length} more times.
            </span>{" "}
            View change history
          </Disclosure>
          <div className={styles.restOfChangesItemsWrapper} id={id}>
            {open &&
              restOfChanges.map((change) => {
                return (
                  <ChangeDisplay
                    change={change}
                    key={`${episode.full_name}-${change.date_changed}`}
                  />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

const ChangeDisplay = ({ change }) => {
  return (
    <div className={styles.ChangeDisplayWrapper}>
      <p className={styles.ChangeDisplayDate}>{getDateString(change.date_changed)}</p>
      <p className={styles.ChangeDisplay}>
        <span className={styles.displayTime}>{formatMsToTimeString(change.old_duration)}</span>
        <span>&gt;</span>
        <span className={styles.displayTime}>{formatMsToTimeString(change.new_duration)}</span>
      </p>
    </div>
  );
};

export default ChangeDetails;
