import { ReactComponent as AlertIcon } from "../icons/alertIcon.svg";
import styles from "./Error.module.css";

const Error = ({ error }) => {
  return (
    <div className={styles.error}>
      <AlertIcon className={styles.icon} />
      {error}
    </div>
  );
};

export default Error;
