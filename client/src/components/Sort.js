import { ReactComponent as Arrow } from "../icons/arrow.svg";
import { useEffect, useState } from "react";
import classnames from "classnames";
import styles from "./Sort.module.css";

const Sort = ({ setEpisodesShown, searchRef, allEpisodes }) => {
    const options = ["episode number", "date removed"];
    const [selected, setSelected] = useState({ name: options[0], reverse: false });
    console.log(searchRef?.current?.value || "");

    useEffect(() => {
        setEpisodesShown(() => {
            return [
                // Make sure the array we're sorting from is always the same, and not affected by a previous search option, which would happen if we used the state from the callback.
                ...(allEpisodes?.filter((ep) =>
                    ep.full_name
                        ?.toLowerCase()
                        .includes(searchRef.current.value?.toLowerCase())
                ) || []),
            ].sort((a, b) => {
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
    }, [selected, setEpisodesShown, allEpisodes, searchRef]);

    return (
        <div className={styles.sort}>
            <p>sort by</p>
            <div className={styles.options}>
                {options.map((o) => {
                    return (
                        <Option
                            optionName={o}
                            key={o}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    );
                })}
            </div>
        </div>
    );
};

function Option({ optionName, selected, setSelected }) {
    const [reverse, setReverse] = useState(false);
    const isSelected = selected.name === optionName;

    return (
        <div
            role="radiogroup"
            className={classnames(styles.option, {
                [styles.selected]: isSelected,
            })}
            onClick={() => {
                console.log("onclick");
                if (isSelected) {
                    setReverse((reverse) => !reverse);
                }
                setSelected({ name: optionName, reverse: isSelected ? !reverse : reverse });
            }}
        >
            <div role="radio" className={styles.label} aria-checked={isSelected}>
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
