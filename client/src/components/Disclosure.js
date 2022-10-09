import styles from "./Disclosure.module.css";
import classnames from "classnames";

const Disclosure = ({ isOpen, onClick, className, ariaControls, children }) => {
  return (
    <button
      aria-controls={ariaControls}
      className={classnames(className, styles.Disclosure, {
        [styles.open]: isOpen,
      })}
      onClick={onClick}>
      {children}
    </button>
  );
};

export default Disclosure;
