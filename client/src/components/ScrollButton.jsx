import TextTransition, { presets } from "react-text-transition";
import classnames from "classnames";
import ArrowDown from "../icons/ScrollButtonIcon.svg";
import styles from "./ScrollButton.module.css";

const ScrollButton = ({ showSkeleton, scrollTarget, scrollable }) => {
  const shouldHide = !scrollable || showSkeleton;

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
      <ArrowDown
        className={classnames(styles.arrow, {
          [styles.up]: scrollTarget === "top",
        })}
      />
      <div className={styles.ScrollText}>
        to{" "}
        <TextTransition
          springConfig={presets.gentle}
          inline={true}
          direction={scrollTarget === "top" ? "up" : "down"}>
          {scrollTarget}
        </TextTransition>
      </div>
    </button>
  );
};

export default ScrollButton;
