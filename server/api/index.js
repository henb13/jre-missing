const express = require("express");
const router = express.Router();
const DB = require("../db/db");
const pool = require("../db/connect");
const { mockResponse } = require("./__mocks__/mockResponse");

router.use(express.json());
require("dotenv").config();

let missingEpisodesCache;
let shortenedEpisodesCache;
let lastCheckedCache;

const { CRON_INTERVAL, USE_MOCK_DATA, NODE_ENV } = process.env;

router.get("/api/episodes", async (_, res) => {
  if (NODE_ENV === "development" && USE_MOCK_DATA === "true") {
    return res.json(mockResponse);
  }
  //

  const timeSinceLastCheckedDbInMins =
    lastCheckedCache && (Date.now() - lastCheckedCache) / 1000 / 60;

  const cacheTimeLeftSecs = Math.floor((CRON_INTERVAL - timeSinceLastCheckedDbInMins) * 60);
  const buffer = 120;

  res.header({
    "cache-control": `no-transform, max-age=${cacheTimeLeftSecs + buffer || 1}`,
    "Access-Control-Allow-Origin": "http://localhost:3000",
  });

  if (
    !missingEpisodesCache ||
    !shortenedEpisodesCache ||
    timeSinceLastCheckedDbInMins > CRON_INTERVAL
  ) {
    await (async () => {
      const client = await pool.connect();
      const db = DB(client);
      try {
        missingEpisodesCache = await db.getMissingEpisodes();
        shortenedEpisodesCache = await db.getShortenedEpisodes();
        lastCheckedCache = await db.getLastChecked();
        console.info("db queried and cache updated");
      } finally {
        client.release();
      }
    })().catch((err) => console.error(err.message));
  }

  console.info("request fired");
  res.json({
    missingEpisodes: missingEpisodesCache,
    shortenedEpisodes: shortenedEpisodesCache,
    lastCheckedInMs: lastCheckedCache,
  });
});

module.exports = router;
