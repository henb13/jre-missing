import classnames from "classnames";
import { useState } from "react";
import styles from "./Searchbox.module.css";
import { ReactComponent as SearchIcon } from "../icons/SearchboxIcon.svg";

const Searchbox = ({
  searchText,
  missingEpisodes,
  handleSearch,
  shakeEpisodes,
}) => {
  const [placeholder, setPlaceholder] = useState("Search for episode or guest");

  const classesSearchIcon = classnames(styles.SearchIcon, {
    [styles.hoverCursor]: searchText != "",
  });

  return (
    <>
      <div className={styles.Searchbox}>
        <input
          value={searchText}
          onChange={handleSearch}
          type="text"
          id="search"
          placeholder={placeholder}
          onFocus={() => setPlaceholder(null)}
          onBlur={() => setPlaceholder("Search for episode or guest")}
          onKeyUp={e => {
            if (e.key === "Enter") shakeEpisodes();
          }}
          spellCheck="false"
          autoComplete="off"
          disabled={!missingEpisodes}
        />

        <SearchIcon
          className={classesSearchIcon}
          title="search-icon"
          onClick={() => searchText !== "" && shakeEpisodes()}
        />
      </div>
      {searchText && (
        <p className={styles.searchResult}>
          {missingEpisodes.length} result
          {missingEpisodes.length != 1 && "s"} found
        </p>
      )}
    </>
  );
};

export default Searchbox;
