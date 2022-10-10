import TextTransition, { presets } from "react-text-transition";
import classnames from "classnames";
import { ReactComponent as ArrowDown } from "../icons/ScrollButtonIcon.svg";
import styles from "./ScrollButton.module.css";

const ScrollButton = ({ dataPending, minLoadingTimeElapsed, scrollTarget, scrollable }) => {
  const shouldHide = !scrollable || dataPending || !minLoadingTimeElapsed;

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
        [styles.hidden]: shouldHide,
      })}
      disabled={shouldHide}
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
