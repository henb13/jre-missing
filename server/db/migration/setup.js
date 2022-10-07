const missingEpisodesPerNow = require("./missingEpisodesPerNow");
const getSpotifyEpisodes = require("../../lib/getSpotifyEpisodes");
const getEpisodeNumber = require("../../lib/getEpisodeNumber");
const pool = require("../connect");

require("dotenv").config();

getSpotifyEpisodes().then(async (episodes) => {
  const allEpisodes = episodes.concat(missingEpisodesPerNow);
  allEpisodes.sort((a, b) => getEpisodeNumber(a.name) - getEpisodeNumber(b.name));

  await (async () => {
    for (const ep of allEpisodes) {
      const client = await pool.connect();
      const epNumber = getEpisodeNumber(ep.name);

      try {
        const onSpotify = !missingEpisodesPerNow.includes(ep.name);
        await client.query(`INSERT INTO all_eps VALUES(DEFAULT, $1, $2, $3, $4)`, [
          epNumber,
          ep.name,
          onSpotify,
          ep.duration,
        ]);
      } finally {
        client.release();
      }
    }
  })().catch((err) => console.error(err.message));

  console.info("inserts done");
});
