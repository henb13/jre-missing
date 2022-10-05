import React from "react";
import classnames from "classnames";
import styles from "./EpisodeList.module.css";
import Episode from "./Episode";
import SkeletonList from "../skeletons/SkeletonList";

const EpisodeList = ({ missingEpisodesShown, shouldShake, showSkeleton }) => {
  if (showSkeleton) return <SkeletonList />;

  const classesEpList = classnames(styles.EpisodeList, {
    shake: shouldShake,
  });

  return (
    <ul className={classesEpList}>
      {missingEpisodesShown?.map((ep) => (
        <React.Fragment key={ep.full_name + ep.episode_number}>
          <Border />
          <Episode
            number={ep.episode_number}
            name={ep.full_name}
            removedDate={ep.date_removed}
          />
        </React.Fragment>
      ))}
    </ul>
  );
};

const Border = () => {
  return <span className={styles.Border}></span>;
};

export default EpisodeList;
