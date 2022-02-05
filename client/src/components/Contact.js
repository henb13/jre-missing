import styles from "./Contact.module.css";

import { ReactComponent as EmailIcon } from "../icons/email.svg";

const Contact = () => {
    return (
        <a href="mailto:henbc13@gmail.com" className={styles.contact}>
            contact
            <EmailIcon className={styles.contactIcon} />
        </a>
    );
};

export default Contact;
