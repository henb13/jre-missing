const missingEpisodesPerNow = require("./missingEpisodesPerNow");
const getSpotifyEpisodes = require("../../lib/getSpotifyEpisodes");
const getEpisodeNumber = require("../../lib/getEpisodeNumber");
const pool = require("../connect");

async function setup() {
  const spotifyEpisodes = await getSpotifyEpisodes();

  // the known-missing episodes are plain name strings; give them the same shape
  const allEpisodes = spotifyEpisodes.concat(
    missingEpisodesPerNow.map((name) => ({ name, duration: null }))
  );
  allEpisodes.sort((a, b) => getEpisodeNumber(a.name) - getEpisodeNumber(b.name));

  const client = await pool.connect();

  try {
    for (const ep of allEpisodes) {
      const onSpotify = !missingEpisodesPerNow.includes(ep.name);

      await client.query(
        "INSERT INTO all_eps(episode_number, full_name, on_spotify, duration) VALUES($1, $2, $3, $4)",
        [getEpisodeNumber(ep.name), ep.name, onSpotify, ep.duration]
      );
    }

    console.info("inserts done");
  } finally {
    client.release();
    await pool.end();
  }
}

setup().catch((err) => {
  console.error("setup failed:", err);
  process.exitCode = 1;
});
