const pg = require("pg");
const pool = new pg.Pool();

const DB = require("../../db/db");
const getEpisodeNumber = require("../../lib/getEpisodeNumber");
const getSpotifyEpisodes = require("../../lib/getSpotifyEpisodes");

async function refreshDb() {
  await (async () => {
    const client = await pool.connect();
    const db = DB(client);
    try {
      console.info("worker running");

      const spotifyEpisodes = await getSpotifyEpisodes();
      if (!spotifyEpisodes) {
        throw new Error("No spotify episodes got fetched!");
      }
      const spotifyEpisodeNames = spotifyEpisodes.map((ep) => ep.name);
      let allEpisodes = await db.getAllEpisodes();
      let someEpisodeNameGotUpdated = false;

      for (const dbEpisode of allEpisodes) {
        const correspondingSpotifyEpisode = spotifyEpisodes.find(
          (ep) => ep.name === dbEpisode.full_name
        );

        if (correspondingSpotifyEpisode && !dbEpisode.duration) {
          console.info(
            `Inserting missing duration for episode ${dbEpisode.full_name} (duration: ${correspondingSpotifyEpisode.duration}) `
          );
          await db.updateEpisodeDuration(correspondingSpotifyEpisode.duration, dbEpisode.id);
        } else if (correspondingSpotifyEpisode) {
          if (correspondingSpotifyEpisode.duration !== dbEpisode.duration) {
            await db.updateEpisodeDuration(correspondingSpotifyEpisode.duration, dbEpisode.id);
            console.info(
              ` \n\n Spotify has changed the duration of episode: ${dbEpisode.full_name} \n
                      from: ${dbEpisode.duration} \n 
                      to: ${correspondingSpotifyEpisode.duration} \n\n`
            );
          }
        }
      }

      for (const spotifyEpisode of spotifyEpisodes) {
        for (const dbEpisode of allEpisodes) {
          if (
            dbEpisode.episode_number &&
            didEpisodeChangeName(spotifyEpisode.name, dbEpisode)
          ) {
            await db.updateEpisodeName(spotifyEpisode.name, dbEpisode.id);
            someEpisodeNameGotUpdated = true;
            console.info(
              ` \n\n spotify updated the name of an episode! \n
                                  from: ${dbEpisode.full_name} \n 
                                  to: ${spotifyEpisode.name} \n\n`
            );
            break;
          }
        }
        const isNewRelease = !allEpisodes.some((ep) => ep.full_name === spotifyEpisode.name);
        if (isNewRelease) {
          console.info(`New episode released: ${spotifyEpisode.name}`);
          await db.insertNewEpisode(spotifyEpisode);
        }
      }

      if (someEpisodeNameGotUpdated) allEpisodes = await db.getAllEpisodes();

      for (const dbEpisode of allEpisodes) {
        if (!spotifyEpisodeNames.includes(dbEpisode.full_name)) {
          if (dbEpisode.on_spotify) {
            await db.setSpotifyStatus(dbEpisode, false);
            console.info(`\n\nNew episode removed!: ${dbEpisode.full_name} \n\n`);
          }
        } else if (!dbEpisode.on_spotify) {
          await db.setSpotifyStatus(dbEpisode, true);
          console.info(`\n\nNew episode re-added: ${dbEpisode.full_name} \n\n`);
        }
      }

      await db.setLastCheckedNow();
      console.info("Worker ran successfully");
    } finally {
      client.release();
    }
  })().catch((err) => console.warn(`Worker failed to run: ${err.message}`));
}

function didEpisodeChangeName(spotifyEpisodeName, dbEpisode) {
  const epNumber = getEpisodeNumber(spotifyEpisodeName);
  const { full_name, episode_number } = dbEpisode;
  return (
    full_name !== spotifyEpisodeName &&
    epNumber == episode_number &&
    !full_name.toLowerCase().includes("(part") &&
    !spotifyEpisodeName.toLowerCase().includes("(part")
  );
}

refreshDb();

module.exports = refreshDb;
