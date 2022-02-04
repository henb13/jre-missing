import classnames from "classnames";
import styles from "./EpisodeList.module.css";
import Episode from "./Episode";

const EpisodeList = ({ episodesShown, shouldShake }) => {
    const classesEpList = classnames(styles.EpisodeList, {
        shake: shouldShake,
    });

    return (
        <ul className={classesEpList}>
            {episodesShown.map(({ episode_number, full_name, date_removed }) => (
                <Episode
                    number={episode_number}
                    name={full_name}
                    removedDate={date_removed}
                    key={full_name + episode_number}
                />
            ))}
        </ul>
    );
};

export default EpisodeList;
