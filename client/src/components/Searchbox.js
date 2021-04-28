import { useState } from "react";
import styles from "./Searchbox.module.css";
import { ReactComponent as SearchIcon } from "../icons/SearchboxIcon.svg";

const Searchbox = ({
  searchText,
  missingEpisodes,
  handleSearch,
  handleSearchClick,
}) => {
  const [placeholder, setPlaceholder] = useState("Search for episode or guest");

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
            if (e.key === "Enter") handleSearchClick();
          }}
          spellCheck="false"
          autoComplete="off"
          disabled={!missingEpisodes}
        />

        <SearchIcon
          className={`${styles.SearchIcon} ${
            searchText != "" ? styles.hoverCursor : ""
          }`}
          title="search-icon"
          onClick={handleSearchClick}
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
