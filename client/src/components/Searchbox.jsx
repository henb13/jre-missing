import classnames from "classnames";
import { useState } from "react";
import styles from "./Searchbox.module.css";
import SearchIcon from "../icons/SearchboxIcon.svg";

//Rewrite the Searchbox component below but without forwardRef
const Searchbox = ({
  episodes,
  setEpisodes,
  allEpisodes,
  shakeEpisodes,
  searchText,
  setSearchText,
}) => {
  const [placeholder, setPlaceholder] = useState("Search for episode or guest");
  // TODO: useeffect isteden som setter episode ved tab change
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
          onKeyUp={(e) => {
            if (e.key === "Enter") shakeEpisodes();
          }}
          spellCheck="false"
          autoComplete="off"
        />

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
      </div>
      {searchText && (
        <p className={styles.searchResult}>
          {episodes.length} result
          {episodes.length != 1 && "s"} found
        </p>
      )}
    </>
  );
};

export default Searchbox;
