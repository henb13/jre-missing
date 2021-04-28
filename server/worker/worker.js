const schedule = require("node-schedule");
// const pg = require("pg");
// const pool = new pg.Pool();
const refeshDb = require("./tasks/refresh-db");
// const DB = require("../db/db");
// const getEpisodeNumber = require("../lib/getEpisodeNumber");
// const getSpotifyEpisodes = require("../lib/getSpotifyEpisodes");
require("dotenv").config();
// eslint-disable-next-line no-undef
const { CRON_INTERVAL } = process.env;

schedule.scheduleJob(`*/${CRON_INTERVAL} * * * *`, refeshDb);
