import classnames from "classnames";
import { useState } from "react";
import styles from "./Searchbox.module.css";
import SearchIcon from "../icons/SearchboxIcon.svg";

const PLACEHOLDER = "search episode or guest…";

const Searchbox = ({
  episodes,
  setEpisodes,
  allEpisodes,
  shakeEpisodes,
  searchText,
  setSearchText,
}) => {
  const [placeholder, setPlaceholder] = useState(PLACEHOLDER);

  const handleSearch = (e) => {
    setEpisodes(() => {
      return allEpisodes.filter((ep) =>
        ep.full_name?.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setSearchText(e.target.value);
  };

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

              navigator.vibrate();
            }
          }}
        />

        <input
          value={searchText}
          onChange={handleSearch}
          type="text"
          id="search"
          placeholder={placeholder}
          onFocus={() => setPlaceholder(null)}
          onBlur={() => setPlaceholder(PLACEHOLDER)}
          onKeyUp={(e) => {
            if (e.key === "Enter") shakeEpisodes();
          }}
          spellCheck="false"
          autoComplete="off"
        />
      </div>
      {searchText && (
        <p className={styles.searchResult}>
          {episodes.length} result
          {episodes.length != 1 && "s"} found
        </p>
      )}
    </div>
  );
};

export default Searchbox;
