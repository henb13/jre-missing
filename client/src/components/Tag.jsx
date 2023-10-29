import classnames from "classnames";
import { Tooltip } from "react-tooltip";
import styles from "./Tag.module.css";

const variantClasses = {
  new: styles.new,
  originalLength: styles.originalLength,
};

const Tag = ({ className, variant, children, toolTip }) => (
  <span className={classnames(styles.tag, className, variantClasses[variant])}>
    <span className={styles.tagName}>{children}</span>
    {toolTip && (
      <>
        <span
          data-tooltip-id="my-tooltip"
          data-tooltip-content={toolTip}
          className={styles.toolTip}>
          &#63;
        </span>
        <Tooltip id="my-tooltip" clickable className={styles.toolTipElement} />
      </>
    )}
  </span>
);

export default Tag;
