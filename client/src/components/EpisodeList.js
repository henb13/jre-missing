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
  searchText,
  listShown,
  setListShown,
  resetCurrentEpisodes,
}) => {
  if (showSkeleton) return <SkeletonList />;
  if (!missingEpisodesShown && !shortenedEpisodesShown) return null;

  const classesEpList = classnames(styles.EpisodeList, {
    shake: shouldShake,
  });

  const listIdRemoved = "episode-list-removed";
  const listIdShortened = "episode-list-shortened";
  const tabIdRemoved = "tab-removed";
  const tabIdShortened = "tab-shortened";
  return (
    <div className={styles.wrapper}>
      <ListTabs
        listShown={listShown}
        setListShown={setListShown}
        resetCurrentEpisodes={resetCurrentEpisodes}
        listIdRemoved={listIdRemoved}
        listIdShortened={listIdShortened}
        tabIdRemoved={tabIdRemoved}
        tabIdShortened={tabIdShortened}
      />
      <>
        {listShown === "removed" ? (
          <RemovedList
            searchText={searchText}
            episodes={missingEpisodesShown}
            className={classesEpList}
            id={listIdRemoved}
            ariaLabelledBy={tabIdRemoved}
          />
        ) : (
          <ShortenedList
            searchText={searchText}
            episodes={shortenedEpisodesShown}
            className={classesEpList}
            id={listIdShortened}
            ariaLabelledBy={tabIdShortened}
          />
        )}
      </>
    </div>
  );
};

const RemovedList = ({ episodes, searchText, className, id, ariaLabelledBy }) => {
  return (
    <ul className={className} role="tabpanel" id={id} aria-labelledby={ariaLabelledBy}>
      {episodes.length > 0
        ? episodes.map((ep) => (
            <li
              className={styles.EpisodeItem}
              key={ep.full_name + ep.episode_number}
              lang="en">
              <Border />
              <Episode
                variant="removed"
                name={ep.full_name}
                number={ep.episode_number}
                date={ep.date}
                isNew={ep.isNew}
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

const ShortenedList = ({ episodes, searchText, className, id, ariaLabelledBy }) => {
  return (
    <ul className={className} role="tabpanel" id={id} aria-labelledby={ariaLabelledBy}>
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
                  name={ep.full_name}
                  number={ep.episode_number}
                  date={ep.changes[0].date}
                  isNew={ep.isNew}
                  isOriginalLength={ep.isOriginalLength}
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

const Border = ({ visible }) => {
  return (
    <span
      className={classnames(styles.Border, {
        [styles.visible]: visible,
      })}></span>
  );
};

export default EpisodeList;
