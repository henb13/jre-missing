const { differenceInDays, parseISO } = require("date-fns");
const {
  formatMsToTimeString,
  getDateString,
  getDateTimeHTMLAttribute,
} = require("../utils/utils");

const DAYS_THRESHOLD_NEW = 14;

const getIsEpisodeNewlyReleased = (time) =>
  time &&
  differenceInDays(new Date(), parseISO(new Date(time).toISOString())) < DAYS_THRESHOLD_NEW;

const mapMissingEpisodes = (missingEpisodes) => {
  return missingEpisodes.map((ep) => {
    const { full_name, episode_number, date_removed } = ep;
    const ms = parseInt(date_removed);

    return {
      full_name,
      episode_number,
      isNew: getIsEpisodeNewlyReleased(ms),
      date: ms
        ? {
            ms,
            formatted: getDateString(ms),
            htmlAttribute: getDateTimeHTMLAttribute(ms),
          }
        : null,
    };
  });
};

const mapShortenedEpisodes = (shortenedEpisodes) => {
  return shortenedEpisodes.reduce((acc, curr) => {
    const { id, episode_number, full_name, date_changed, new_duration, old_duration } = curr;

    const ms = parseInt(date_changed);

    const changeItem = {
      date: {
        ms,
        formatted: getDateString(ms),
        htmlAttribute: getDateTimeHTMLAttribute(ms),
      },
      new_duration_string: formatMsToTimeString(new_duration),
      old_duration_string: formatMsToTimeString(old_duration),
    };

    const index = acc.findIndex((item) => item.id === curr.id);

    if (index === -1) {
      acc.push({
        id,
        episode_number,
        full_name,
        isNew: getIsEpisodeNewlyReleased(ms),
        changes: [changeItem],
      });
    } else {
      acc[index].changes.push(changeItem);
    }
    return acc;
  }, []);
};

const mapLastChecked = (rows) => {
  return parseInt(rows[0]?.miliseconds);
};

module.exports = {
  mapMissingEpisodes,
  mapShortenedEpisodes,
  mapLastChecked,
};
