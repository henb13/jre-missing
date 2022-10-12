const { formatMsToTimeString, getDateString } = require("../utils/utils");

const { differenceInDays, parseISO } = require("date-fns");

const DAYS_THRESHOLD_NEW = 14;

const getIsEpisodeNewlyReleased = (time) =>
  time && differenceInDays(new Date(), parseISO(new Date(time))) < DAYS_THRESHOLD_NEW;

const mapMissingEpisodes = (missingEpisodes) => {
  return missingEpisodes.map((ep) => {
    const date_removed = parseInt(ep.date_removed);
    return {
      ...ep,
      isNew: getIsEpisodeNewlyReleased(date_removed),
      date_removed,
    };
  });
};

const mapShortenedEpisodes = (shortenedEpisodes) => {
  return shortenedEpisodes.reduce((acc, curr) => {
    const {
      id,
      episode_number,
      full_name,
      date_changed: date_change_raw,
      new_duration,
      old_duration,
    } = curr;

    const date_changed = parseInt(date_change_raw);

    const changeItem = {
      date_changed,
      date_changed_string: getDateString(date_changed),
      new_duration_string: formatMsToTimeString(new_duration),
      old_duration_string: formatMsToTimeString(old_duration),
    };

    const index = acc.findIndex((item) => item.id === curr.id);

    if (index > 0) {
      acc[index].changes.push(changeItem);
    } else {
      acc.push({
        id,
        episode_number,
        full_name,
        isNew: getIsEpisodeNewlyReleased(changeItem.date_changed),
        changes: [changeItem],
      });
    }
    return acc;
  }, []);
};

module.exports = {
  mapMissingEpisodes,
  mapShortenedEpisodes,
};
