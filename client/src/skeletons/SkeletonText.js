import styles from "./SkeletonStyles.module.css";

const SkeletonText = () => {
  return (
    <>
      <div className={`${styles.SkeletonElement} ${styles.first}`}>
        <div className={styles.SkeletonShimmerWrapper}>
          <div className={styles.SkeletonShimmer}></div>
        </div>
      </div>
      <div className={`${styles.SkeletonElement} ${styles.second}`}>
        <div className={styles.SkeletonShimmerWrapper}>
          <div className={styles.SkeletonShimmer}></div>
        </div>
      </div>
      <div className={`${styles.SkeletonElement} ${styles.third}`}>
        <div className={styles.SkeletonShimmerWrapper}>
          <div className={styles.SkeletonShimmer}></div>
        </div>
      </div>
    </>
  );
};

export default SkeletonText;
