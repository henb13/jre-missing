import classnames from "classnames";
import styles from "./Searchbox.module.css";
import SearchIcon from "../icons/SearchboxIcon.svg";

const Searchbox = ({ resultsCount, shakeEpisodes, searchText, setSearchText }) => {
  const classesSearchIcon = classnames(styles.SearchIcon, {
    [styles.hoverCursor]: searchText,
  });

  return (
    <div className={styles.SearchArea}>
      <div className={styles.Searchbox}>
        <SearchIcon
          className={classesSearchIcon}
          title="search-icon"
          onClick={() => {
            if (searchText) {
              shakeEpisodes();
              navigator.vibrate?.(100);
            }
          }}
        />

        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          type="text"
          id="search"
          placeholder="search episode or guest…"
          onKeyUp={(e) => {
            if (e.key === "Enter") shakeEpisodes();
          }}
          spellCheck="false"
          autoComplete="off"
        />
      </div>
      {searchText && (
        <p className={styles.searchResult}>
          {resultsCount} result
          {resultsCount !== 1 && "s"} found
        </p>
      )}
    </div>
  );
};

export default Searchbox;
