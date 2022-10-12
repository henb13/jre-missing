import { zonedTimeToUtc, utcToZonedTime, format as formatTz } from "date-fns-tz";

export const getClientLocalTime = (date, pattern) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcDate = zonedTimeToUtc(date, userTimezone);
  const zonedDate = utcToZonedTime(utcDate, userTimezone);
  const lastCheckedDate = formatTz(zonedDate, pattern, {
    timeZone: userTimezone,
  });
  return lastCheckedDate;
};

export const getDateString = (time) => {
  return getClientLocalTime(time, "PPP");
};

export const getDateTimeHTMLAttribute = (time) => {
  return getClientLocalTime(time, "yyyy-MM-dd");
};

export const formatMinutesToTimeAmountString = (minutes) => {
  if (minutes < 1) {
    return "less than a minute ";
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

    return `${hours} ${hoursString} ${
      minutesRest === 0 ? "" : `and ${minutesRest} ${minutesString}`
    }`;
  }

  const days = Math.floor(minutes / (60 * 24));
  const daysString = days === 1 ? "day" : "days";
  return `${days} ${daysString}`;
};

const setPlurality = (text, number) => {
  return `${text}${number === 1 ? "" : "s"}`;
};
