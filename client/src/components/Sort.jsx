import Arrow from "../icons/arrow.svg";
import { useState } from "react";
import classnames from "classnames";
import styles from "./Sort.module.css";
import Disclosure from "./Disclosure";
import Chavron from "../icons/chavron.svg";

const options = {
  removed: ["episode number", "date removed"],
  shortened: ["episode number", "date shortened"],
};

const displayNames = {
  "episode number": "episode №",
  "date removed": "date removed",
  "date shortened": "date shortened",
};

const Sort = ({ listShown, sort, setSort }) => {
  const [open, setOpen] = useState(false);

  const disclosureId = "sort-by-toggle";
  const optionsWrapperId = "sort-by-content";

  return (
    <div
      className={classnames(styles.sort, {
        [styles.open]: open,
      })}>
      <Disclosure
        className={styles.sortDisclosure}
        isOpen={open}
        onClick={() => setOpen((open) => !open)}
        id={disclosureId}
        ariaControls={optionsWrapperId}>
        sort: {displayNames[sort.name] || sort.name} {sort.reverse ? "↑" : "↓"}
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
        aria-labelledby={disclosureId}>
        {options[listShown]?.map((option) => (
          <Option optionName={option} key={option} sort={sort} setSort={setSort} />
        ))}
      </div>
    </div>
  );
};

function Option({ optionName, sort, setSort }) {
  const isSelected = sort.name === optionName;
  const isReversed = isSelected && sort.reverse;

  function handleClick() {
    setSort({ name: optionName, reverse: isSelected ? !isReversed : false });
  }

  return (
    <button
      role="option"
      aria-selected={isSelected}
      className={classnames(styles.option, {
        [styles.selected]: isSelected,
      })}
      onClick={handleClick}>
      <div className={styles.label}>{displayNames[optionName] || optionName}</div>

      <Arrow
        className={classnames(styles.icon, {
          [styles.iconReverse]: isReversed,
        })}
      />
    </button>
  );
}

export default Sort;
