const express = require("express");
const router = express.Router();
const DB = require("../db/db");
const pool = require("../db/connect");

router.use(express.json());
require("dotenv").config();

let missingEpisodesCache;
let allEpisodesCache;
let lastCheckedCache;

// eslint-disable-next-line no-undef
const { CRON_INTERVAL } = process.env;

router.get("/api/episodes", async (_, res) => {
  const timeSinceLastCheckedMins =
    lastCheckedCache && (Date.now() - lastCheckedCache.miliseconds) / 1000 / 60;

  const cacheTimeLeftSecs = Math.floor(
    (CRON_INTERVAL - timeSinceLastCheckedMins) * 60
  );

  const buffer = 120;

  res.header({
    "cache-control": `no-transform, max-age=${cacheTimeLeftSecs + buffer || 1}`,
    "Access-Control-Allow-Origin": "http://localhost:3000",
  });

  if (!missingEpisodesCache || timeSinceLastCheckedMins > CRON_INTERVAL) {
    await (async () => {
      const client = await pool.connect();
      const db = DB(client);
      try {
        missingEpisodesCache = await db.getMissingEpisodes();
        lastCheckedCache = await db.getLastChecked();
        allEpisodesCache = await db.getAllEpisodes();
        console.log("db queried and cache updated");
      } finally {
        client.release();
      }
    })().catch(err => console.log(err.message));
  }

  console.log("request fired");
  console.log(lastCheckedCache);
  res.json({
    episodes: missingEpisodesCache,
    allEpisodes: allEpisodesCache,
    lastChecked: lastCheckedCache,
  });
});

module.exports = router;
