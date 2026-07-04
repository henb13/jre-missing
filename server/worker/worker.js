const schedule = require("node-schedule");
const refreshDb = require("./tasks/refreshDb");
require("dotenv").config();
const { CRON_INTERVAL_EVERY_X_HOURS } = process.env;

refreshDb();

schedule.scheduleJob(`2 */${CRON_INTERVAL_EVERY_X_HOURS} * * *`, refreshDb);
