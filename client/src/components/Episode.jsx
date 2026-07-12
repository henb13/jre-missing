import styles from "./Episode.module.css";
import Tag from "./Tag";
import { getDateStringMono, getDateTimeHTMLAttribute } from "../utils";

const TOOL_TIP_TEXT =
  "This episode is now as long as it originally was before it was shortened the first time. This does not mean nothing has been edited out since its release. It simply means that the current duration matches its original duration. The editing history is documented here.";

const Episode = ({ variant, name, number, date, isNew, isOriginalLength }) => {
  const guest = name.split("-").slice(1).join("-");

  const tags = (
    <>
      {isNew && <Tag variant="new">new</Tag>}
      {variant === "shortened" && isOriginalLength && (
        <Tag variant="originalLength" toolTip={TOOL_TIP_TEXT}>
          original length
        </Tag>
      )}
    </>
  );

  return (
    <div className={styles.epRow}>
      {number ? (
        <>
          <span className={styles.epNumber}>#{number}</span>
          <span className={styles.epGuest}>
            {guest}
            {tags}
          </span>
        </>
      ) : (
        <span className={styles.epGuest}>
          {name}
          {tags}
        </span>
      )}
      {date && (
        <time className={styles.epDate} dateTime={getDateTimeHTMLAttribute(date.ms)}>
          {getDateStringMono(date.ms)}
        </time>
      )}
    </div>
  );
};

export default Episode;
