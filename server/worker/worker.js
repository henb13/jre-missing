const schedule = require("node-schedule");
const refreshDb = require("./tasks/refreshDb");
require("dotenv").config();
// eslint-disable-next-line no-undef
const { CRON_INTERVAL_EVERY_X_HOURS } = process.env;

schedule.scheduleJob(`2 */${CRON_INTERVAL_EVERY_X_HOURS} * * *`, refreshDb);
