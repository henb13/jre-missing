import {
  zonedTimeToUtc,
  utcToZonedTime,
  format as formatTz,
} from "date-fns-tz";

export default (date, pattern) => {
  const visitorTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcDate = zonedTimeToUtc(date, visitorTimezone);
  const zonedDate = utcToZonedTime(utcDate, visitorTimezone);
  const lastCheckedDate = formatTz(zonedDate, pattern, {
    timeZone: visitorTimezone,
  });
  return lastCheckedDate;
};
