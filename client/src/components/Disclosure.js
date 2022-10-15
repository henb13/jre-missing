import styles from "./Disclosure.module.css";
import classnames from "classnames";

const Disclosure = ({ isOpen, onClick, className, ariaControls, id, children }) => {
  return (
    <button
      id={id}
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
