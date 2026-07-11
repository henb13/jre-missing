import styles from "./ListTabs.module.css";
import classnames from "classnames";

const ListTabs = ({
  listShown,
  setListShown,
  resetCurrentEpisodes,
  listIdRemoved,
  listIdShortened,
  tabIdRemoved,
  tabIdShortened,
  removedTotal,
  shortenedTotal,
}) => {
  return (
    <div className={styles.ListTab} role="tablist" aria-orientation="horizontal">
      <Option
        title="Removed"
        count={removedTotal}
        isSelected={listShown === "removed"}
        onClick={() => {
          setListShown("removed");
          resetCurrentEpisodes();
        }}
        id={tabIdRemoved}
        ariaControls={listIdRemoved}
      />
      <Option
        title="Shortened"
        count={shortenedTotal}
        isSelected={listShown === "shortened"}
        onClick={() => {
          setListShown("shortened");
          resetCurrentEpisodes();
        }}
        id={tabIdShortened}
        ariaControls={listIdShortened}
      />
    </div>
  );
};

const Option = ({ title, count, onClick, isSelected, ariaControls, id }) => {
  return (
    <button
      id={id}
      className={classnames(styles.option, {
        [styles.selected]: isSelected,
      })}
      onClick={onClick}
      role="tab"
      aria-selected={isSelected}
      aria-controls={ariaControls}
      type="button">
      {title} <span className={styles.count}>{count}</span>
    </button>
  );
};

export default ListTabs;
