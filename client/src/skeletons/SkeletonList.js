import { useRef } from "react";
import styles from "./SkeletonStyles.module.css";

const SkeletonList = () => {
    const stylesArr = useRef(
        Array.apply(null, Array(42)).map(() => {
            const random = Math.random();
            const type =
                random > 85
                    ? styles.extraLarge
                    : random > 0.6
                    ? styles.large
                    : random > 0.333
                    ? styles.medium
                    : random > 0.15
                    ? styles.small
                    : styles.extraSmall;

            return type;
        })
    );

    return (
        <div className={`${styles.SkeletonList}`}>
            {stylesArr.current?.map((st, i) => {
                return (
                    <div
                        key={i}
                        className={`${styles.SkeletonElement} ${styles.listElement} ${st}`}
                    >
                        <div className={styles.SkeletonShimmerWrapper}>
                            <div className={styles.SkeletonShimmer}></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SkeletonList;
