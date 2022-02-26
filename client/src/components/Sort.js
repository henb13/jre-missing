import { ReactComponent as Arrow } from "../icons/arrow.svg";
import { useEffect, useState } from "react";
import classnames from "classnames";
import styles from "./Sort.module.css";

const Sort = ({ setEpisodesShown }) => {
    const options = ["episode number", "date removed"];
    const [selected, setSelected] = useState({ name: options[0], reverse: false });

    useEffect(() => {
        setEpisodesShown((episodesShown) => {
            return [...episodesShown].sort((a, b) => {
                [a, b] = selected.reverse ? [a, b] : [b, a];
                switch (selected.name) {
                    case "episode number":
                        return a.episode_number - b.episode_number;
                    case "date removed":
                        return new Date(a.date_removed) - new Date(b.date_removed);
                    default:
                        return 0;
                }
            });
        });
    }, [selected, setEpisodesShown]);

    return (
        <div className={styles.sort}>
            <p>sort by</p>
            <div className={styles.options}>
                {options.map((o, i) => {
                    return (
                        <Option
                            optionName={o}
                            key={o}
                            index={i}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    );
                })}
            </div>
        </div>
    );
};

function Option({ optionName, index, selected, setSelected }) {
    const [reverse, setReverse] = useState(false);
    const isSelected = selected.name === optionName;

    return (
        <div
            className={classnames(styles.option, {
                [styles.selected]: isSelected,
            })}
            onClick={() => {
                if (isSelected) {
                    setReverse((reverse) => !reverse);
                    setSelected({ name: optionName, reverse: !reverse });
                } else {
                    setSelected({ name: optionName, reverse: reverse });
                }
            }}
        >
            <input
                type="radio"
                id={optionName + index}
                name={optionName + " option"}
                value={optionName}
                className="sr-only"
            />
            <label className={styles.label} htmlFor={optionName + index}>
                {optionName
                    .split(" ")
                    .map((word) => word[0].toUpperCase() + word.slice(1))
                    .join(" ")}
            </label>
            <Arrow
                className={classnames(styles.icon, {
                    [styles.iconReverse]: reverse,
                })}
            />
        </div>
    );
}

export default Sort;
