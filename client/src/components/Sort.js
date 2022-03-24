import { ReactComponent as Arrow } from "../icons/arrow.svg";
import { ReactComponent as Chavron } from "../icons/chavron.svg";
import { useEffect, useState } from "react";
import classnames from "classnames";
import styles from "./Sort.module.css";

const Sort = ({ setEpisodesShown, searchRef, allEpisodes }) => {
    const options = ["episode number", "date removed"];
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState({ name: options[0], reverse: false });
    useEffect(() => {
        if (!allEpisodes) return;

        setEpisodesShown(() => {
            return allEpisodes
                .filter((ep) =>
                    ep.full_name
                        ?.toLowerCase()
                        .includes(searchRef.current.value?.toLowerCase())
                )
                .sort((a, b) => {
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
            <p onClick={() => setOpen((open) => !open)}>
                Sort by{" "}
                <Chavron
                    className={classnames(styles.chavron, {
                        [styles.open]: open,
                    })}
                />
            </p>
            <div role="listbox" className={styles.options}>
                {options?.map((o) => {
                    return (
                        <Option
                            className={classnames({
                                [styles.open]: open,
                            })}
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

function Option({ optionName, selected, setSelected, className }) {
    const [reverse, setReverse] = useState(false);
    const isSelected = selected.name === optionName;

    return (
        <div
            role="option"
            aria-selected={isSelected}
            aria-labelledby="option-label"
            className={classnames(className, styles.option, {
                [styles.selected]: isSelected,
            })}
            onClick={() => {
                if (isSelected) {
                    setReverse((reverse) => !reverse);
                }
                setSelected({ name: optionName, reverse: isSelected ? !reverse : reverse });
            }}
        >
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
