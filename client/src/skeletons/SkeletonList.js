import { useEffect, useState } from "react";
import styles from "./SkeletonStyles.module.css";

const SkeletonList = () => {
    const [stylesArr, setStylesArr] = useState(0);

    const arr = Array.apply(null, Array(42));
    useEffect(() => {
        const stylesArray = arr.map(() => {
            const random = Math.random();
            const type =
                random > 95
                    ? styles.extraLarge
                    : random > 0.85
                    ? styles.large
                    : random > 0.333
                    ? styles.medium
                    : styles.small;

            return type;
        });

        setStylesArr(stylesArray);
    }, []);

    return (
        <div className={`${styles.SkeletonList}`}>
            {arr.map((_, i) => {
                return (
                    <div
                        key={i}
                        className={`${styles.SkeletonElement} ${styles.listElement} ${stylesArr[i]}`}
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
