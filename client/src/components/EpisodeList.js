import React, { useState } from "react";
import classnames from "classnames";
import styles from "./EpisodeList.module.css";
import Episode from "./Episode";
import SkeletonList from "../skeletons/SkeletonList";
import ListTabs from "./ListTabs";

const EpisodeList = ({
  missingEpisodesShown,
  shortenedEpisodesShown,
  shouldShake,
  showSkeleton,
}) => {
  const [listShown, setListShown] = useState("removed");
  if (showSkeleton) return <SkeletonList />;

  const classesEpList = classnames(styles.EpisodeList, {
    shake: shouldShake,
  });

  return (
    <div className={styles.wrapper}>
      <ListTabs listShown={listShown} setListShown={setListShown} />
      <ul className={classesEpList}>
        {listShown === "removed"
          ? missingEpisodesShown?.map((ep) => (
              <React.Fragment key={ep.full_name + ep.episode_number}>
                <Border />
                <Episode
                  variant="removed"
                  number={ep.episode_number}
                  name={ep.full_name}
                  dateInMs={ep.date_removed}
                />
              </React.Fragment>
            ))
          : shortenedEpisodesShown?.map((ep) => {
              return (
                <React.Fragment key={ep.full_name + ep.episode_number}>
                  <Border />
                  <Episode
                    variant="shortened"
                    number={ep.episode_number}
                    name={ep.full_name}
                    dateInMs={ep.changes[0].date_changed}
                  />
                </React.Fragment>
              );
            })}
      </ul>
    </div>
  );
};

const Border = () => {
  return <span className={styles.Border}></span>;
};

export default EpisodeList;
