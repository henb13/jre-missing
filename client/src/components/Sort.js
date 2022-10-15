import { useEffect } from "react";
import { ReactComponent as Arrow } from "../icons/arrow.svg";
import { useState } from "react";
import classnames from "classnames";
import styles from "./Sort.module.css";
import Disclosure from "./Disclosure";
import { ReactComponent as Chavron } from "../icons/chavron.svg";

const options = {
  removed: ["episode number", "date removed"],
  shortened: ["episode number", "date shortened"],
};

const initialState = { name: "episode number", reverse: false };

const Sort = ({ setEpisodes, episodes, listShown }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(initialState);

  useEffect(() => {
    setSelected(initialState);
  }, [listShown]);

  const handleSort = (option, isReversed) => {
    let nulls;
    let nonNulls;
    if (option === "date shortened") {
      nulls = [];
      nonNulls = nonNulls = episodes.sort((a, b) => {
        [a, b] = isReversed ? [a, b] : [b, a];
        return a.changes[0].date.ms - b.changes[0].date.ms;
      });
    } else if (option === "date removed") {
      nulls = episodes.filter((ep) => !ep.date);
      nonNulls = episodes
        .filter((ep) => ep.date)
        .sort((a, b) => {
          [a, b] = isReversed ? [a, b] : [b, a];
          return a.date.ms - b.date.ms;
        });
      // episode number
    } else {
      nulls = episodes.filter((ep) => !ep.episode_number);
      nonNulls = episodes
        .filter((ep) => ep.episode_number)
        .sort((a, b) => {
          [a, b] = isReversed ? [a, b] : [b, a];
          return a.episode_number - b.episode_number;
        });
    }

    setEpisodes([...nonNulls, ...nulls]);
  };

  const disclosureId = "sort-by-toggle";
  const optionsWrapperId = "sort-by-content";

  return (
    <div
      className={classnames(styles.sort, {
        [styles.open]: open,
      })}>
      <Disclosure
        isOpen={open}
        onClick={() => setOpen((open) => !open)}
        id={disclosureId}
        ariaControls={optionsWrapperId}>
        Sort by
        <Chavron
          className={classnames(styles.Chavron, {
            [styles.open]: open,
          })}
        />
      </Disclosure>
      <div
        role="listbox"
        className={styles.optionsWrapper}
        id={optionsWrapperId}
        aria-labelledby={disclosureId}
        aria-expanded={open}>
        {options[listShown]?.map((option) => {
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
  const isReversed = isSelected && selected.reverse;
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
