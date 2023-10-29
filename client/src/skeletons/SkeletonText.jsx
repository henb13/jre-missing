import classnames from "classnames";
import styles from "./SkeletonStyles.module.css";

const SkeletonElement = ({ elStyle }) => {
  return (
    <div className={`${styles.SkeletonElement} ${elStyle}`}>
      <div className={styles.SkeletonShimmerWrapper}>
        <div className={styles.SkeletonShimmer}></div>
      </div>
    </div>
  );
};

const SkeletonText = () => {
  return (
    <div className={styles.skeletonText}>
      <SkeletonElement elStyle={styles.amount} />
      <SkeletonElement elStyle={classnames(styles.amount, styles.shortened)} />
      <SkeletonElement elStyle={styles.lastChecked} />
    </div>
  );
};

export default SkeletonText;
