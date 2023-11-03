const express = require("express");
const router = express.Router();
const DB = require("../db/db");
const pool = require("../db/connect");
const NodeCache = require("node-cache");

router.use(express.json());

const cache = new NodeCache({ stdTTL: 3600 });

const KEYS = {
  missingEpisodes: "missing-episodes",
  shortenedEpisodes: "shortened-episodes",
  lastChecked: "last-checked",
};

router.get("/api/episodes", async (_, res) => {
  console.info("request fired");

  const missingCacheExists = cache.has(KEYS.missingEpisodes);
  const shortenedCacheExists = cache.has(KEYS.shortenedEpisodes);
  const lastCheckedExists = cache.has(KEYS.lastChecked);

  if ([missingCacheExists, shortenedCacheExists, lastCheckedExists].some((c) => !c)) {
    const client = await pool.connect();
    const db = DB(client);

    try {
      if (!missingCacheExists) {
        const missingEpisodes = await db.getMissingEpisodes();
        cache.set(KEYS.missingEpisodes, missingEpisodes);
      }

      if (!shortenedCacheExists) {
        const shortenedEpisodes = await db.getShortenedEpisodes();
        cache.set(KEYS.shortenedEpisodes, shortenedEpisodes);
      }

      if (!lastCheckedExists) {
        const lastChecked = await db.getLastChecked();
        cache.set(KEYS.lastChecked, lastChecked);
      }

      console.info("db queried and cache updated");
    } catch (error) {
      console.error(error.message);
    } finally {
      client.release();
    }
  }

  res.json({
    missingEpisodes: cache.get(KEYS.missingEpisodes),
    shortenedEpisodes: cache.get(KEYS.shortenedEpisodes),
    lastCheckedInMs: cache.get(KEYS.lastChecked),
  });
});

module.exports = router;
