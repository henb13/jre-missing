import styles from "./Contact.module.css";

import EmailIcon from "../icons/email.svg";

const Contact = () => {
  return (
    <a
      href="mailto:henbc13@gmail.com"
      className={styles.contact}
      aria-label="send me an email">
      <span>contact me</span>
      <EmailIcon className={styles.contactIcon} />
    </a>
  );
};

export default Contact;
