const schedule = require("node-schedule");
const refreshDb = require("./tasks/refreshDb");
require("dotenv").config();
// eslint-disable-next-line no-undef
const { CRON_INTERVAL } = process.env;

schedule.scheduleJob(`*/${CRON_INTERVAL} * * * *`, refreshDb);
