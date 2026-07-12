import styles from "./ListTabs.module.css";
import classnames from "classnames";

export const getListId = (list) => `episode-list-${list}`;
export const getTabId = (list) => `tab-${list}`;

const TABS = [
  { list: "removed", title: "Removed" },
  { list: "shortened", title: "Shortened" },
];

const ListTabs = ({ listShown, onListChange, removedTotal, shortenedTotal }) => {
  const counts = { removed: removedTotal, shortened: shortenedTotal };

  return (
    <div className={styles.ListTab} role="tablist" aria-orientation="horizontal">
      {TABS.map(({ list, title }) => (
        <Option
          key={list}
          title={title}
          count={counts[list]}
          isSelected={listShown === list}
          onClick={() => onListChange(list)}
          id={getTabId(list)}
          ariaControls={getListId(list)}
        />
      ))}
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
