import React from "react";
import classnames from "classnames";
import styles from "./EpisodeList.module.css";
import Episode from "./Episode";
import SkeletonList from "../skeletons/SkeletonList";

const EpisodeList = ({ episodesShown, shouldShake, showSkeleton }) => {
    const classesEpList = classnames(styles.EpisodeList, {
        shake: shouldShake,
    });

    if (showSkeleton) {
        return <SkeletonList />;
    }

    return (
        <ul className={classesEpList}>
            {episodesShown?.map((ep, i) => (
                <React.Fragment key={ep.full_name + ep.episode_number}>
                    {i === 0 && <Border />}
                    <Episode
                        number={ep.episode_number}
                        name={ep.full_name}
                        removedDate={ep.date_removed}
                    />
                    {i !== episodesShown.length - 1 && <Border />}
                </React.Fragment>
            ))}
        </ul>
    );
};

const Border = () => {
    return <span className={styles.Border}></span>;
};

export default EpisodeList;
