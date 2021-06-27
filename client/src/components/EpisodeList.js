import classnames from "classnames";
import styles from "./EpisodeList.module.css";
import RemovedDate from "./RemovedDate";

const EpisodeList = ({ episodes, shouldAnimate }) => {
  const classesEpList = classnames(styles.EpisodeList, {
    shake: shouldAnimate,
  });

  return (
    <ul className={classesEpList}>
      {episodes.map(ep => {
        let [epNr, ...guest] = ep.full_name.split("-");
        guest = guest.join("-");

        return (
          <li className={styles.EpisodeItem} key={ep.full_name} lang="en">
            {ep.episode_number ? (
              <>
                <span className={styles.epNr}>{epNr.trim()}</span>
                {guest.trim()}
              </>
            ) : (
              ep.full_name.trim()
            )}
            {ep.removed && <RemovedDate removedDate={ep.removed} />}
          </li>
        );
      })}
    </ul>
  );
};

export default EpisodeList;
