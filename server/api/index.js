const express = require("express");
const router = express.Router();
const DB = require("../db/db");
const pool = require("../db/connect");

router.use(express.json());
require("dotenv").config();

let missingEpisodesCache;
let lastCheckedCache;
const ratioMissing = {
    missing: 0,
    total: 0,
    percent: 0
}
let leaderBoard = [];

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
                const allEpisodes = await db.getAllEpisodes();
                ratioMissing.total = allEpisodes.length;
                ratioMissing.missing = missingEpisodesCache.length;
                ratioMissing.percent =
                  (
                    ((ratioMissing.missing || 0) * 100) /
                    (ratioMissing.total || 1)
                  ).toFixed() + '%';
                const guestList = {};
                missingEpisodesCache
                  .map((ep) => ep.full_name)
                  .map((ep) => ep.replace(/#\d+\s-\s/, '')) // remove episode numbers
                  .map((ep) => ep.replace(/\s\(part\s\w+\)/i, '')) // remove (part 1)
                  .map((ep) =>
                    ep.startsWith('Fight Companion') ? 'Fight Companion' : ep
                  ) // remove fight companion dates
                  .map((ep) => ep.split(/,\s|\s&\s/g)) // split guests
                  .forEach((ep) => {
                    ep.forEach((g) => {
                      if (guestList[g]) guestList[g]++;
                      else guestList[g] = 1;
                    });
                  });
                leaderBoard = Object.keys(guestList)
                  .map((g) => {
                    return { guest: g, episodes: guestList[g] };
                  })
                  .sort((a, b) => b.episodes - a.episodes);
                lastCheckedCache = await db.getLastChecked();
                console.log("db queried and cache updated");
            } finally {
                client.release();
            }
        })().catch(err => console.log(err.message));
    }

    console.log("request fired");
    res.json({
        missingEpisodes: missingEpisodesCache,
        lastChecked: lastCheckedCache,
        ratioMissing,
        leaderBoard,
    });
});

module.exports = router;
