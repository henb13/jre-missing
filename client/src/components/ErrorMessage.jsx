import AlertIcon from "../icons/alertIcon.svg";
import styles from "./ErrorMessage.module.css";

const ErrorMessage = ({ error }) => {
  return (
    <div className={styles.error}>
      <AlertIcon className={styles.icon} />
      {error}
    </div>
  );
};

export default ErrorMessage;
