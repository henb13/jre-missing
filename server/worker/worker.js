const schedule = require("node-schedule");
const refeshDb = require("./tasks/refresh-db");
require("dotenv").config();
// eslint-disable-next-line no-undef
const { CRON_INTERVAL } = process.env;

schedule.scheduleJob(`*/${CRON_INTERVAL} * * * *`, refeshDb);
