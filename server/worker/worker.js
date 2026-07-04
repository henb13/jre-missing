// dotenv must load before requiring refreshDb, which reads Spotify creds at require time
require("dotenv").config();

const schedule = require("node-schedule");
const refreshDb = require("./tasks/refreshDb");

const DEFAULT_INTERVAL_HOURS = 2;

const parsedInterval = parseInt(process.env.CRON_INTERVAL_EVERY_X_HOURS, 10);
const intervalHours =
  Number.isInteger(parsedInterval) && parsedInterval > 0
    ? parsedInterval
    : DEFAULT_INTERVAL_HOURS;

if (intervalHours !== parsedInterval) {
  console.warn(
    `CRON_INTERVAL_EVERY_X_HOURS is not set to a positive integer (got "${process.env.CRON_INTERVAL_EVERY_X_HOURS}"), falling back to every ${DEFAULT_INTERVAL_HOURS} hours`
  );
}

refreshDb();

const job = schedule.scheduleJob(`2 */${intervalHours} * * *`, refreshDb);

if (!job) {
  throw new Error(`Failed to schedule worker with cron spec "2 */${intervalHours} * * *"`);
}

console.info(`Worker scheduled to run every ${intervalHours} hours`);
