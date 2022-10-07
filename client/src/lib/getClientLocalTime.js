import { zonedTimeToUtc, utcToZonedTime, format as formatTz } from "date-fns-tz";

export default function getClientLocalTime(date, pattern) {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcDate = zonedTimeToUtc(date, userTimezone);
  const zonedDate = utcToZonedTime(utcDate, userTimezone);
  const lastCheckedDate = formatTz(zonedDate, pattern, {
    timeZone: userTimezone,
  });
  return lastCheckedDate;
}
