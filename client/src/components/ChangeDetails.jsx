import { useState } from "react";
import classnames from "classnames";
import Disclosure from "./Disclosure";
import styles from "./ChangeDetails.module.css";
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
          <span className={styles.displayTime}>{latestChange.old_duration_string}</span>
        </p>
        <span>&gt;</span>
        <p>
          <span className={styles.displayTime}>{latestChange.new_duration_string}</span>
        </p>
      </div>
      {restOfChanges.length > 0 && (
        <div className={styles.restOfChanges}>
          <div className={styles.headingWrapper}>
            <p className={styles.heading}>
              Has been changed {restOfChanges.length} more time
              {restOfChanges.length === 1 ? "" : "s"} previously.
            </p>
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
                {[latestChange, ...restOfChanges].map((change) => {
                  return (
                    <ChangeDisplay
                      change={change}
                      key={`${episode.id}-${change.date.ms}-${change.new_duration}`}
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
  const {
    date: { formatted, htmlAttribute },
    old_duration_string,
    new_duration_string,
  } = change;
  return (
    <div className={styles.ChangeDisplayWrapper}>
      <time dateTime={htmlAttribute} className={styles.ChangeDisplayDate}>
        {formatted}
      </time>
      <p className={styles.ChangeDisplay}>
        <span className={styles.displayTime}>{old_duration_string}</span>
        <span>&gt;</span>
        <span className={styles.displayTime}>{new_duration_string}</span>
      </p>
    </div>
  );
};

export default ChangeDetails;
