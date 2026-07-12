import classnames from "classnames";
import { Tooltip } from "react-tooltip";
import styles from "./Tag.module.css";

const TOOLTIP_ID = "tag-tooltip";

const variantClasses = {
  new: styles.new,
  originalLength: styles.originalLength,
};

const Tag = ({ className, variant, children, toolTip }) => (
  <span className={classnames(styles.tag, className, variantClasses[variant])}>
    <span className={styles.tagName}>{children}</span>
    {toolTip && (
      <span
        data-tooltip-id={TOOLTIP_ID}
        data-tooltip-content={toolTip}
        className={styles.toolTip}>
        &#63;
      </span>
    )}
  </span>
);

export const TagTooltip = () => (
  <Tooltip id={TOOLTIP_ID} clickable className={styles.toolTipElement} />
);

export default Tag;
