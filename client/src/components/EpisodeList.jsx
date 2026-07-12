import classnames from "classnames";
import styles from "./EpisodeList.module.css";
import Episode from "./Episode";
import SkeletonList from "../skeletons/SkeletonList.jsx";
import ListTabs, { getListId, getTabId } from "./ListTabs";
import ChangeDetails from "./ChangeDetails";

const EpisodeList = ({
  episodes,
  shouldShake,
  showSkeleton,
  searchText,
  listShown,
  onListChange,
  removedTotal,
  shortenedTotal,
  controls,
}) => {
  if (showSkeleton) return <SkeletonList />;

  const isShortened = listShown === "shortened";

  return (
    <div className={styles.wrapper}>
      <ListTabs
        listShown={listShown}
        onListChange={onListChange}
        removedTotal={removedTotal}
        shortenedTotal={shortenedTotal}
      />
      {controls}
      <ul
        className={classnames(styles.EpisodeList, { shake: shouldShake })}
        role="tabpanel"
        id={getListId(listShown)}
        aria-labelledby={getTabId(listShown)}>
        {episodes.length > 0
          ? episodes.map((ep) => (
              <li
                className={classnames(styles.EpisodeItem, {
                  [styles.shortenedEpisode]: isShortened,
                })}
                key={ep.full_name + ep.episode_number}
                lang="en">
                <Episode
                  variant={listShown}
                  name={ep.full_name}
                  number={ep.episode_number}
                  date={isShortened ? ep.changes[0].date : ep.date}
                  isNew={ep.isNew}
                  isOriginalLength={ep.isOriginalLength}
                />
                {isShortened && <ChangeDetails episode={ep} />}
              </li>
            ))
          : !searchText && (
              <div className={styles.NoEpisodesMessage}>
                No episodes have been {listShown} yet. Check back later!
              </div>
            )}
      </ul>
    </div>
  );
};

export default EpisodeList;
