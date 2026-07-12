import { format } from "date-fns";

export const getClientLocalTime = (date, pattern) => {
  return format(new Date(date), pattern);
};

export const DEFAULT_SORT = { name: "episode number", reverse: false };

const sortValueGetters = {
  "episode number": (ep) => ep.episode_number,
  "date removed": (ep) => ep.date?.ms,
  "date shortened": (ep) => ep.changes?.[0]?.date.ms,
};

export const sortEpisodes = (episodes, { name, reverse }) => {
  const getValue = sortValueGetters[name] || sortValueGetters[DEFAULT_SORT.name];
  const withValue = episodes.filter((ep) => getValue(ep));
  const withoutValue = episodes.filter((ep) => !getValue(ep));

  withValue.sort((a, b) => (reverse ? getValue(a) - getValue(b) : getValue(b) - getValue(a)));

  return [...withValue, ...withoutValue];
};

export const filterEpisodes = (episodes, searchText) => {
  if (!searchText) return episodes;
  return episodes.filter((ep) =>
    ep.full_name?.toLowerCase().includes(searchText.toLowerCase())
  );
};

export const getDateString = (time) => {
  return getClientLocalTime(time, "PPP");
};

export const getDateStringMono = (time) => {
  return getClientLocalTime(time, "MMM dd yyyy").toUpperCase();
};

export const getDateTimeHTMLAttribute = (time) => {
  return getClientLocalTime(time, "yyyy-MM-dd");
};

export const formatMinutesToTimeAmountString = (minutes) => {
  if (minutes < 1) {
    return "less than a minute ago";
  }

  if (minutes < 60) {
    const minutesString = setPlurality("minute", minutes);
    return `${minutes} ${minutesString}`;
  }
  if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const hoursString = setPlurality("hour", hours);
    const minutesRest = minutes % 60;
    const minutesString = setPlurality("minute", minutesRest);

    return `${hours} ${hoursString}${
      minutesRest === 0 ? "" : ` and ${minutesRest} ${minutesString}`
    }`;
  }

  const days = Math.floor(minutes / (60 * 24));
  const daysString = days === 1 ? "day" : "days";
  return `${days} ${daysString}`;
};

const setPlurality = (text, number) => {
  return `${text}${number === 1 ? "" : "s"}`;
};
