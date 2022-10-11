import { useState } from "react";
import classnames from "classnames";
import Disclosure from "./Disclosure";
import styles from "./ChangeDetails.module.css";
import { getDateString, formatMsToTimeString } from "../utils";
import { ReactComponent as Chavron } from "../icons/chavron.svg";

const ChangeDetails = ({ episode }) => {
  const [open, setOpen] = useState(false);
  const disclosureId = `${episode.full_name}-toggle`;

  const [latestChange, ...restOfChanges] = episode.changes;

  const disclosureProps = {
    isOpen: open,
    onClick: () => {
      setOpen((open) => !open);
    },
    ariaControls: `${episode.full_name}-change-history-wrapper`,
    id: disclosureId,
  };

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
          <div className={styles.headingWrapper}>
            <p className={styles.heading}>
              Has been changed {restOfChanges.length} more times.
            </p>{" "}
            <Disclosure className={styles.historyToggle} {...disclosureProps}>
              <span>View change history</span>
              <Chavron
                className={classnames(styles.Chavron, {
                  [styles.open]: open,
                })}
              />
            </Disclosure>
          </div>
          <div
            aria-expanded={open}
            aria-labelledby={disclosureId}
            id={`${episode.full_name}-change-history-wrapper`}>
            {open && (
              <div className={styles.restOfChangesItems}>
                {restOfChanges.map((change) => {
                  return (
                    <ChangeDisplay
                      change={change}
                      key={`${episode.full_name}-${change.date_changed}`}
                    />
                  );
                })}
              </div>
            )}
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
