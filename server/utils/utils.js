import { zonedTimeToUtc, utcToZonedTime, format as formatTz } from "date-fns-tz";

const getClientLocalTime = (date, pattern) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcDate = zonedTimeToUtc(date, userTimezone);
  const zonedDate = utcToZonedTime(utcDate, userTimezone);
  const lastCheckedDate = formatTz(zonedDate, pattern, {
    timeZone: userTimezone,
  });
  return lastCheckedDate;
};

const getDateString = (time) => {
  return getClientLocalTime(time, "PPP");
};

const getDateTimeHTMLAttribute = (time) => {
  return getClientLocalTime(time, "yyyy-MM-dd");
};

const formatMsToTimeString = (time) => {
  const hours = Math.floor(time / 1000 / 60 / 60);
  const minutesRest = (time / 1000 / 60) % 60;
  const seconds = (time / 1000) % 60;
  return `${Math.floor(hours)} hr ${Math.floor(minutesRest)} min ${Math.floor(seconds)} sec`;
};

module.exports = {
  getClientLocalTime,
  formatMsToTimeString,
  getDateString,
  getDateTimeHTMLAttribute,
};
