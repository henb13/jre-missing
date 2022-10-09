import { useState } from "react";
import classnames from "classnames";
import styles from "./EpisodeList.module.css";
import Episode from "./Episode";
import SkeletonList from "../skeletons/SkeletonList";
import ListTabs from "./ListTabs";
import ChangeDetails from "./ChangeDetails";

const EpisodeList = ({
  missingEpisodesShown,
  shortenedEpisodesShown,
  shouldShake,
  showSkeleton,
  searchRef,
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
          ? missingEpisodesShown
              ?.filter((ep) =>
                ep.full_name
                  ?.toLowerCase()
                  .includes(searchRef.current?.value?.toLowerCase?.() ?? "")
              )
              .map((ep) => (
                <li
                  className={styles.EpisodeItem}
                  key={ep.full_name + ep.episode_number}
                  lang="en">
                  <Border />
                  <Episode
                    variant="removed"
                    number={ep.episode_number}
                    name={ep.full_name}
                    dateInMs={ep.date_removed}
                  />
                </li>
              ))
          : shortenedEpisodesShown
              ?.filter((ep) =>
                ep.full_name
                  ?.toLowerCase()
                  .includes(searchRef.current?.value?.toLowerCase?.() ?? "")
              )
              .map((ep) => {
                return (
                  <li
                    className={classnames(styles.EpisodeItem, styles.shortenedEpisode)}
                    key={ep.full_name + ep.episode_number}
                    lang="en">
                    <Border />
                    <Episode
                      variant="shortened"
                      number={ep.episode_number}
                      name={ep.full_name}
                      dateInMs={ep.changes[0].date_changed}
                    />
                    <ChangeDetails episode={ep} />
                  </li>
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
