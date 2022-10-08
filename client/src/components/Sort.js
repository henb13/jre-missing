import { ReactComponent as Arrow } from "../icons/arrow.svg";
import { ReactComponent as Chavron } from "../icons/chavron.svg";
import { useState } from "react";
import classnames from "classnames";
import styles from "./Sort.module.css";

const OptionToPropertyMap = {
  "episode number": "episode_number",
  "date removed": "date_removed",
};

const Sort = ({ setMissingEpisodesShown, allEpisodes }) => {
  const options = ["episode number", "date removed"];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({ name: options[0], reverse: false });

  const handleSort = (option, isReversed) => {
    const property = OptionToPropertyMap[option];
    const nulls = allEpisodes.filter((ep) => !ep[property]);
    const nonNulls = allEpisodes
      .filter((ep) => ep[property])
      .sort((a, b) => {
        [a, b] = isReversed ? [a, b] : [b, a];
        return a[property] - b[property];
      });

    setMissingEpisodesShown([...nonNulls, ...nulls]);
  };

  return (
    <div
      className={classnames(styles.sort, {
        [styles.open]: open,
      })}>
      <button className={styles.heading} onClick={() => setOpen((open) => !open)}>
        Sort by <Chavron className={styles.chavron} />
      </button>
      <div role="listbox" className={styles.optionsWrapper}>
        {options?.map((option) => {
          return (
            <Option
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

function Option({ optionName, selected, setSelected, handleSort }) {
  const isSelected = selected.name === optionName;
  const isReversed = selected.name === optionName && selected.reverse;
  function handleClick() {
    const newReverse = isSelected ? !isReversed : isReversed;
    setSelected({ name: optionName, reverse: newReverse });
    handleSort(optionName, newReverse);
  }

  return (
    <button
      role="option"
      aria-selected={isSelected}
      aria-labelledby="option-label"
      className={classnames(styles.option, {
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
          [styles.iconReverse]: isReversed,
        })}
      />
    </button>
  );
}

export default Sort;
