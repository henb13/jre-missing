import classnames from "classnames";
import styles from "./EpisodeList.module.css";
import Episode from "./Episode";
import SkeletonList from "../skeletons/SkeletonList";
import ListTabs from "./ListTabs";
import ChangeDetails from "./ChangeDetails";

const EpisodeList = ({
  episodes,
  shouldShake,
  showSkeleton,
  searchText,
  listShown,
  setListShown,
  resetCurrentEpisodes,
}) => {
  if (showSkeleton) return <SkeletonList />;

  const listProps = {
    searchText,
    shouldShake,
    episodes,
  };

  return (
    <div className={styles.wrapper}>
      <ListTabs
        listShown={listShown}
        setListShown={setListShown}
        resetCurrentEpisodes={resetCurrentEpisodes}
      />
      {listShown === "removed" ? (
        <RemovedList {...listProps} />
      ) : (
        <ShortenedList {...listProps} />
      )}
    </div>
  );
};

const ShortenedList = ({ episodes, shouldShake, searchText }) => {
  const classesEpList = classnames(styles.EpisodeList, {
    shake: shouldShake,
  });

  return (
    <ul className={classesEpList}>
      {episodes.length > 0
        ? episodes.map((ep, i) => {
            return (
              <li
                className={classnames(styles.EpisodeItem, styles.shortenedEpisode)}
                key={ep.full_name + ep.episode_number}
                lang="en">
                {i !== 0 && <Border />}
                <Episode
                  variant="shortened"
                  number={ep.episode_number}
                  name={ep.full_name}
                  dateInMs={ep.changes[0].date_changed}
                />
                <ChangeDetails episode={ep} />
              </li>
            );
          })
        : !searchText && (
            <div className={styles.NoEpisodesMessage}>
              No episodes have been shortened yet. Check back later!
            </div>
          )}
    </ul>
  );
};
const RemovedList = ({ episodes, shouldShake, searchText }) => {
  const classesEpList = classnames(styles.EpisodeList, {
    shake: shouldShake,
  });

  return (
    <ul className={classesEpList}>
      {episodes.length > 0
        ? episodes.map((ep) => (
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
        : !searchText && (
            <div className={styles.NoEpisodesMessage}>
              No episodes have been removed yet. Check back later!
            </div>
          )}
    </ul>
  );
};

const Border = ({ visible }) => {
  return (
    <span
      className={classnames(styles.Border, {
        [styles.visible]: visible,
      })}></span>
  );
};

export default EpisodeList;
