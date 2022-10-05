import TextTransition, { presets } from "react-text-transition";
import classnames from "classnames";
import { useEffect } from "react";
import { ReactComponent as ArrowDown } from "../icons/ScrollButtonIcon.svg";
import useScroll from "../hooks/useScroll";
import styles from "./ScrollButton.module.css";

const ScrollButton = ({ dataPending, minLoadingTimeElapsed, missingEpisodesShown }) => {
  const { scrollTarget, scrollable, setScrollable } = useScroll();

  useEffect(() => {
    setScrollable(document.body.clientHeight > window.innerHeight);
  }, [missingEpisodesShown, setScrollable]);

  const hidden = !scrollable || dataPending || !minLoadingTimeElapsed;

  function handleClick() {
    window.scroll({
      top: scrollTarget === "top" ? 0 : document.body.clientHeight,
      left: 0,
      behavior: "smooth",
    });
  }

  return (
    <button
      className={classnames(styles.ScrollButton, {
        [styles.up]: scrollTarget === "top",
        [styles.hidden]: hidden,
      })}
      disabled={hidden}
      aria-label={`scroll to ${scrollTarget}`}
      onClick={handleClick}>
      <div className={styles.ScrollText}>
        To{" "}
        <TextTransition
          text={scrollTarget}
          springConfig={presets.gentle}
          inline={true}
          direction={scrollTarget === "top" ? "up" : "down"}
        />
      </div>
      <ArrowDown
        className={classnames(styles.arrow, {
          [styles.up]: scrollTarget === "top",
        })}
      />
    </button>
  );
};

export default ScrollButton;
