import TextTransition, { presets } from "react-text-transition";
import classnames from "classnames";
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

  const scrollClass = scrollDirection === "up" ? styles.up : null;
  const classesBtn = classnames(styles.ScrollButton, scrollClass, {
    [styles.hidden]: hidden,
  });
  const classesArrow = classnames(styles.arrow, scrollClass);

  return (
    <button
      className={classesBtn}
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
        To{" "}
        <TextTransition
          text={scrollDirection === "up" ? "top" : "bottom"}
          springConfig={presets.gentle}
          inline={true}
          direction={scrollDirection}
        />
      </div>
      <ArrowDown className={classesArrow} />
    </button>
  );
};

export default ScrollButton;
