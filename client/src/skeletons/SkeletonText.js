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
    <>
      <SkeletonElement elStyle={styles.first} />
      <SkeletonElement elStyle={styles.second} />
      <SkeletonElement elStyle={styles.third} />
    </>
  );
};

export default SkeletonText;
