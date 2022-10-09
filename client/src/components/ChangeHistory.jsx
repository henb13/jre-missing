import { useState } from "react";
import Disclosure from "./Disclosure";
import styles from "./ChangeHistory.module.css";


const ChangesHistory = ({ changes }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.ChangesHistory}>
      <h2>Changed {changes.length} times</h2>
      <Disclosure
        isOpen={open}
        onClick={() => {
          setOpen((open) => !open);
        }}>
        View change history
      </Disclosure>
      {open &&
        changes.map((change) => {
          return (
            <div className={styles.itemChanges} key={change.date_changed}>
              <h3>
                Date shortened: {change.date_changed}
                <p>From: {change.old_duration}</p>
                <p>To: {change.new_duration}</p>
              </h3>
            </div>
          );
        })}
    </div>
  );
};

export default ChangesHistory;
