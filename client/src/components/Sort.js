import { ReactComponent as Arrow } from "../icons/arrow.svg";
import { ReactComponent as Chavron } from "../icons/chavron.svg";
import { useState } from "react";
import classnames from "classnames";
import styles from "./Sort.module.css";

const Sort = ({ setMissingEpisodesShown, searchRef, allEpisodes }) => {
  const options = ["episode number", "date removed"];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({ name: options[0], reverse: false });

  const handleSort = () => {
    setMissingEpisodesShown(() => {
      return allEpisodes
        .filter((ep) =>
          ep.full_name?.toLowerCase().includes(searchRef.current.value?.toLowerCase())
        )
        .sort((a, b) => {
          [a, b] = selected.reverse ? [b, a] : [a, b];
          switch (selected.name) {
            case "episode number":
              return a.episode_number - b.episode_number;
            case "date removed":
              return a.date_removed - b.date_removed;
            default:
              return 0;
          }
        });
    });
  };

  return (
    <div className={styles.sort}>
      <p onClick={() => setOpen((open) => !open)}>
        Sort by{" "}
        <Chavron
          className={classnames(styles.chavron, {
            [styles.open]: open,
          })}
        />
      </p>
      <div role="listbox" className={styles.options}>
        {options?.map((option) => {
          return (
            <Option
              className={classnames({
                [styles.open]: open,
              })}
              optionName={option}
              key={option}
              handleSort={handleSort}
              selected={selected}
              setSelected={setSelected}
            />
          );
        })}
      </div>
    </div>
  );
};

function Option({ optionName, selected, setSelected, className, handleSort }) {
  const [reverse, setReverse] = useState(false);
  const isSelected = selected.name === optionName;

  function handleClick() {
    if (isSelected) {
      setReverse((reverse) => !reverse);
    }
    setSelected({ name: optionName, reverse: isSelected ? !reverse : reverse });
    handleSort();
  }

  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-labelledby="option-label"
      className={classnames(className, styles.option, {
        [styles.selected]: isSelected,
      })}
      onClick={handleClick}>
      <div className={styles.label} id="option-label">
        {optionName
          .split(" ")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" ")}
      </div>

      <Arrow
        className={classnames(styles.icon, {
          [styles.iconReverse]: reverse,
        })}
      />
    </div>
  );
}

export default Sort;
