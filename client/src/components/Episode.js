import styles from "./Episode.module.css";
import Tag from "./Tag";

const Episode = ({ variant, name, number, date, isNew, isOriginalLength }) => {
  // eslint-disable-next-line no-unused-vars
  let [_, ...guest] = name.split("-");
  guest = guest.join("-");

  return (
    <div className={styles.epContent}>
      <div className={styles.tagsWrapper}>
        {isNew && <Tag variant="new">new</Tag>}
        {variant === "shortened" && isOriginalLength && (
          <Tag
            variant="originalLength"
            toolTip="This episode is now as long as it originally was before it was shortened the first time. This does not mean nothing has been edited out since its release, simply that the current duration is as long as it was when first released. The editing history is kept here.">
            original length
          </Tag>
        )}
      </div>
      <div className={styles.epName}>
        {number ? (
          <>
            <span className={styles.epNumber}>#{number}</span>
            <span className={styles.epGuest}>{guest}</span>
          </>
        ) : (
          name
        )}
      </div>
      {date && (
        <span className={styles.timeDetail}>
          {variant === "removed" ? "Removed" : "Shortened"} on{" "}
          <time dateTime={date.htmlAttribute}>{date.formatted}</time>
        </span>
      )}
    </div>
  );
};

export default Episode;
