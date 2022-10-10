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
  listShown,
  setListShown,
}) => {
  if (showSkeleton) return <SkeletonList />;

  return (
    <div className={styles.wrapper}>
      <ListTabs listShown={listShown} setListShown={setListShown} />
      {listShown === "removed" ? (
        <RemovedList
          searchRef={searchRef}
          shouldShake={shouldShake}
          episodes={missingEpisodesShown}
        />
      ) : (
        <ShortenedList
          searchRef={searchRef}
          shouldShake={shouldShake}
          episodes={shortenedEpisodesShown}
        />
      )}
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
const ShortenedList = ({ episodes, shouldShake, searchRef }) => {
  const classesEpList = classnames(styles.EpisodeList, {
    shake: shouldShake,
  });
  const filteredEpisodes = episodes?.filter((ep) =>
    ep.full_name?.toLowerCase().includes(searchRef.current?.value?.toLowerCase?.() ?? "")
  );

  return (
    <ul className={classesEpList}>
      {filteredEpisodes.length > 0 ? (
        filteredEpisodes.map((ep, i) => {
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
      ) : (
        <div className={styles.NoEpisodesMessage}>
          No episodes have been shortened yet. Check back later!
        </div>
      )}
    </ul>
  );
};
const RemovedList = ({ episodes, searchRef, shouldShake }) => {
  const classesEpList = classnames(styles.EpisodeList, {
    shake: shouldShake,
  });

  const filteredEpisodes = episodes?.filter((ep) =>
    ep.full_name?.toLowerCase().includes(searchRef.current?.value?.toLowerCase?.() ?? "")
  );

  return (
    <ul className={classesEpList}>
      {filteredEpisodes.length > 0 ? (
        filteredEpisodes.map((ep) => (
          <li className={styles.EpisodeItem} key={ep.full_name + ep.episode_number} lang="en">
            <Border />
            <Episode
              variant="removed"
              number={ep.episode_number}
              name={ep.full_name}
              dateInMs={ep.date_removed}
            />
          </li>
        ))
      ) : (
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
