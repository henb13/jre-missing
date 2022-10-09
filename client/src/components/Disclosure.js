import styles from "./Disclosure.module.css";
import classnames from "classnames";
import { ReactComponent as Chavron } from "../icons/chavron.svg";

const Disclosure = ({ isOpen, onClick, className, ariaControls, children }) => {
  return (
    <button
      aria-controls={ariaControls}
      className={classnames(className, styles.Disclosure, {
        [styles.open]: isOpen,
      })}
      onClick={onClick}>
      {children}
      <Chavron className={styles.Chavron} />
    </button>
  );
};

export default Disclosure;
