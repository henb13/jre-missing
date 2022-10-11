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
}) => {
  return (
    <div className={styles.ListTab} role="tablist" aria-orientation="horizontal">
      <Option
        title="Removed"
        isSelected={listShown === "removed"}
        onClick={() => {
          setListShown("removed");
          resetCurrentEpisodes();
        }}
        id={tabIdRemoved}
        ariaControls={listIdRemoved}
      />
      <div className={styles.divider}></div>
      <Option
        title="Shortened"
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

const Option = ({ title, onClick, isSelected, ariaControls, id }) => {
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
      {title}
    </button>
  );
};

export default ListTabs;
