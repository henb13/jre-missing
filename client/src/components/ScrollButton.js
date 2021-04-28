import { useEffect } from "react";
import { ReactComponent as ArrowDown } from "../icons/ScrollButtonIcon.svg";
import useScroll from "../useScroll";
import styles from "./ScrollButton.module.css";

const ScrollButton = ({ isPending, minLoadingTime, missingEpisodes }) => {
  const { scrollDirection, scrollable, setScrollable } = useScroll();

  useEffect(() => {
    setScrollable(document.body.clientHeight > window.innerHeight);
  }, [missingEpisodes, setScrollable]);

  const hidden = !scrollable || isPending || !minLoadingTime;

  const classNames = `${styles.ScrollButton} ${
    scrollDirection === "up" ? styles.up : ""
  } 
  ${hidden ? styles.hidden : ""}`;

  return (
    <button
      className={classNames}
      disabled={hidden}
      aria-label={`scroll to ${scrollDirection === "up" ? "top" : "bottom"}`}
      onClick={() => {
        window.scroll({
          top: scrollDirection === "up" ? 0 : document.body.clientHeight,
          left: 0,
          behavior: "smooth",
        });
      }}
    >
      <div className={styles.ScrollText}>
        To {scrollDirection === "up" ? "top" : "bottom"}
      </div>
      <ArrowDown
        className={`${styles.arrow} ${
          scrollDirection === "up" ? styles.up : ""
        }`}
      />
    </button>
  );
};

export default ScrollButton;
