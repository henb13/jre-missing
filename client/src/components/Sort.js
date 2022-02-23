import { ReactComponent as Arrow } from "../icons/arrow.svg";
import { useEffect, useState } from "react";
import classnames from "classnames";
import styles from "./Sort.module.css";

const Sort = ({ setEpisodesShown }) => {
    const options = ["episode number", "date removed"];
    const [sortOption, setSortOption] = useState(options[0]);
    const [reverse, setReverse] = useState(false);

    useEffect(() => {
        setEpisodesShown((episodesShown) => {
            return [...episodesShown].sort((a, b) => {
                [a, b] = reverse ? [a, b] : [b, a];
                switch (sortOption) {
                    case "episode number":
                        return a.episode_number - b.episode_number;
                    case "date removed":
                        return new Date(a.date_removed) - new Date(b.date_removed);
                    default:
                        return 0;
                }
            });
        });
    }, [sortOption, setEpisodesShown, reverse]);

    return (
        <div className={styles.sort}>
            {options.map((o, i) => {
                return <Option option={o} key={o} index={i} />;
            })}
            <Arrow
                onClick={() => setReverse((reverse) => !reverse)}
                className={classnames(styles.icon, {
                    [styles.iconReverse]: reverse,
                })}
            />
        </div>
    );

    function Option({ option, index }) {
        return (
            <div
                className={styles.option}
                onClick={() => {
                    setSortOption(option);
                }}
            >
                <input
                    type="radio"
                    id={option + index}
                    name={option + " option"}
                    value={option}
                    className="sr-only"
                />
                <label
                    className={classnames(styles.label, {
                        [styles.selected]: sortOption === option,
                    })}
                    htmlFor={option + index}
                >
                    {option
                        .split(" ")
                        .map((word) => word[0].toUpperCase() + word.slice(1))
                        .join(" ")}
                </label>
            </div>
        );
    }
};

export default Sort;
