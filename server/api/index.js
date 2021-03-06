const express = require("express");
const router = express.Router();
const DB = require("../db/db");
const pool = require("../db/connect");

router.use(express.json());
require("dotenv").config();

let missingEpisodesCache;
let lastCheckedCache;

// eslint-disable-next-line no-undef
const { CRON_INTERVAL } = process.env;

router.get("/api/episodes", async (_, res) => {
  const timeSinceLastCheckedDbInMins =
    lastCheckedCache && (Date.now() - lastCheckedCache.miliseconds) / 1000 / 60;

  const cacheTimeLeftSecs = Math.floor((CRON_INTERVAL - timeSinceLastCheckedDbInMins) * 60);
  const buffer = 120;

  res.header({
    "cache-control": `no-transform, max-age=${cacheTimeLeftSecs + buffer || 1}`,
    "Access-Control-Allow-Origin": "http://localhost:3000",
  });

  if (!missingEpisodesCache || timeSinceLastCheckedDbInMins > CRON_INTERVAL) {
    await (async () => {
      const client = await pool.connect();
      const db = DB(client);
      try {
        missingEpisodesCache = await db.getMissingEpisodes();
        lastCheckedCache = await db.getLastChecked();
        console.log("db queried and cache updated");
      } finally {
        client.release();
      }
    })().catch((err) => console.log(err.message));
  }

  console.log("request fired");
  res.json({
    missingEpisodes: missingEpisodesCache,
    lastChecked: lastCheckedCache,
  });
});

module.exports = router;
