const express = require("express");
const router = express.Router();
const DB = require("../db/db");
const pool = require("../db/connect");
const NodeCache = require("node-cache");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

router.use(express.json());

const cache = new NodeCache({ stdTTL: 3600 });

const rateLimiter = rateLimit({
  windowMs: 15 * 1000,
  max: 7,
});

const speedLimiter = slowDown({
  windowMs: 15 * 1000,
  delayAfter: 3,
  delayMs: (hits) => hits * 100,
});

const CACHE_KEYS = {
  missingEpisodes: "missing-episodes",
  shortenedEpisodes: "shortened-episodes",
  lastChecked: "last-checked",
};

router.use(rateLimiter);
router.use(speedLimiter);

router.get("/api/episodes", async (req, res, next) => {
  console.info("request fired");

  const missingCacheExists = cache.has(CACHE_KEYS.missingEpisodes);
  const shortenedCacheExists = cache.has(CACHE_KEYS.shortenedEpisodes);
  const lastCheckedExists = cache.has(CACHE_KEYS.lastChecked);

  if ([missingCacheExists, shortenedCacheExists, lastCheckedExists].some((c) => !c)) {
    const client = await pool.connect();
    const db = DB(client);

    try {
      if (!missingCacheExists) {
        const missingEpisodes = await db.getMissingEpisodes();
        cache.set(CACHE_KEYS.missingEpisodes, missingEpisodes);
      }

      if (!shortenedCacheExists) {
        const shortenedEpisodes = await db.getShortenedEpisodes();
        cache.set(CACHE_KEYS.shortenedEpisodes, shortenedEpisodes);
      }

      if (!lastCheckedExists) {
        const lastChecked = await db.getLastChecked();
        cache.set(CACHE_KEYS.lastChecked, lastChecked);
      }

      client.release();
      console.info("db queried and cache updated");
    } catch (error) {
      console.error(error.message);
      client.release();
      next(error);
    }
  }

  res.json({
    missingEpisodes: cache.get(CACHE_KEYS.missingEpisodes),
    shortenedEpisodes: cache.get(CACHE_KEYS.shortenedEpisodes),
    lastCheckedInMs: cache.get(CACHE_KEYS.lastChecked),
  });
});

module.exports = { api: router };
