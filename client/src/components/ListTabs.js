import styles from "./ListTabs.module.css";
import classnames from "classnames";

const ListTabs = ({ listShown, setListShown, resetCurrentEpisodes }) => {
  return (
    <div className={styles.ListTab}>
      <Option
        listShown={listShown}
        title="Removed"
        onClick={() => {
          setListShown("removed");
          resetCurrentEpisodes();
        }}></Option>
      <div className={styles.divider}></div>
      <Option
        listShown={listShown}
        title="Shortened"
        onClick={() => {
          setListShown("shortened");
          resetCurrentEpisodes();
        }}></Option>
    </div>
  );
};

const Option = ({ title, listShown, onClick }) => {
  return (
    <button
      className={classnames(styles.option, {
        [styles.selected]: listShown === title.toLowerCase(),
      })}
      onClick={onClick}>
      {title}
    </button>
  );
};

export default ListTabs;
