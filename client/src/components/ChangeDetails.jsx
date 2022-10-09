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
      <div className={styles.ChangeDisplayLatest}>
        <p>
          <span className={styles.displayHeading}>From:</span> {latestChange.old_duration}
        </p>
        <p>
          <span className={styles.displayHeading}>To:</span> {latestChange.new_duration}
        </p>
      </div>
      {restOfChanges.length > 0 && (
        <div>
          <h2 className={styles.heading}>Changed {restOfChanges.length} more times</h2>
          <Disclosure
            isOpen={open}
            onClick={() => {
              setOpen((open) => !open);
            }}
            className={styles.historyToggle}
            ariaControls={id}>
            View change history
          </Disclosure>
          <div id={id}>
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
    <div className={styles.ChangeDisplay}>
      <p>
        <span className={styles.displayHeading}>From:</span>{" "}
        {formatMsToTimeString(change.old_duration)}
      </p>
      <p>
        <span className={styles.displayHeading}>To:</span>{" "}
        {formatMsToTimeString(change.new_duration)}
      </p>
      <p>
        <span className={styles.displayHeading}>Date shortened:</span>{" "}
        {getDateString(change.date_changed)}
      </p>
    </div>
  );
};

export default ChangeDetails;
