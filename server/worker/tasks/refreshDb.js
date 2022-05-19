const pg = require("pg");
const pool = new pg.Pool();

const DB = require("../../db/db");
const getEpisodeNumber = require("../../lib/getEpisodeNumber");
const getSpotifyEpisodeNames = require("../../lib/getSpotifyEpisodeNames");

async function refreshDb() {
  await (async () => {
    const client = await pool.connect();
    const db = DB(client);
    try {
      console.log("worker running");

      const spotifyEpisodeNames = await getSpotifyEpisodeNames();
      let allEpisodes = await db.getAllEpisodes();
      let someEpisodeNameGotUpdated = false;

      for (const spotifyEpisode of spotifyEpisodeNames) {
        let isNewRelease = true;

        for (const dbEpisode of allEpisodes) {
          if (
            dbEpisode.episode_number &&
            spotifyEpisodeChangedName(spotifyEpisode, dbEpisode)
          ) {
            await db.updateEpisodeName(spotifyEpisode, dbEpisode.id);
            isNewRelease = false;
            someEpisodeNameGotUpdated = true;

            console.log(
              ` \n spotify updated the name of an episode! \n
                                from: ${dbEpisode.full_name} \n 
                                to: ${spotifyEpisode} \n\n`
            );
            break;
          } else if (dbEpisode.full_name === spotifyEpisode) {
            isNewRelease = false;
            break;
          }
        }
        if (isNewRelease) await db.insertNewEpisode(spotifyEpisode);
      }

      allEpisodes = someEpisodeNameGotUpdated ? await db.getAllEpisodes() : allEpisodes;

      for (const dbEpisode of allEpisodes) {
        if (!spotifyEpisodeNames.includes(dbEpisode.full_name)) {
          if (dbEpisode.on_spotify) {
            await db.setSpotifyStatus(dbEpisode, false);
            console.log("\nnew episode removed(!): " + dbEpisode.full_name + "\n");
          }
        } else if (!dbEpisode.on_spotify) {
          await db.setSpotifyStatus(dbEpisode, true);
          console.log("\nnew episode re-added: " + dbEpisode.full_name + "\n");
        }
      }

      await db.setLastChecked();
    } finally {
      client.release();
      console.log("worker ran successfully");
    }
  })().catch((err) => console.log(err.message));
}

function spotifyEpisodeChangedName(spotifyEpisode, dbEpisode) {
  const epNr = getEpisodeNumber(spotifyEpisode);
  const { full_name, episode_number } = dbEpisode;
  return (
    full_name !== spotifyEpisode &&
    epNr == episode_number &&
    !full_name.toLowerCase().includes("(part") &&
    !spotifyEpisode.toLowerCase().includes("(part")
  );
}

refreshDb();

module.exports = refreshDb;
