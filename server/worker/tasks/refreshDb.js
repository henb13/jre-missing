const pool = require("../../db/connect");
const DB = require("../../db/db");
const getEpisodeNumber = require("../../lib/getEpisodeNumber");
const getSpotifyEpisodes = require("../../lib/getSpotifyEpisodes");

async function refreshDb() {
  let client;

  try {
    console.info("worker running");

    client = await pool.connect();
    const db = DB(client);

    const spotifyEpisodes = await getSpotifyEpisodes();
    const spotifyEpisodeNames = new Set(spotifyEpisodes.map((ep) => ep.name));

    const spotifyEpisodesByName = new Map();
    for (const spotifyEpisode of spotifyEpisodes) {
      if (!spotifyEpisodesByName.has(spotifyEpisode.name)) {
        spotifyEpisodesByName.set(spotifyEpisode.name, spotifyEpisode);
      }
    }

    let allEpisodes = await db.getAllEpisodes();
    let someEpisodeNameGotUpdated = false;

    for (const dbEpisode of allEpisodes) {
      const correspondingSpotifyEpisode = spotifyEpisodesByName.get(dbEpisode.full_name);

      if (correspondingSpotifyEpisode && !dbEpisode.duration) {
        console.info(
          `Inserting missing duration for episode ${dbEpisode.full_name} (duration: ${correspondingSpotifyEpisode.duration}) `
        );

        await db.updateEpisodeDuration(correspondingSpotifyEpisode.duration, dbEpisode.id);
      } else if (
        correspondingSpotifyEpisode &&
        correspondingSpotifyEpisode.duration !== dbEpisode.duration
      ) {
        await db.updateEpisodeDuration(correspondingSpotifyEpisode.duration, dbEpisode.id);

        console.info(
          ` \n\n Spotify has changed the duration of episode: ${dbEpisode.full_name} \n
                  from: ${dbEpisode.duration} \n
                  to: ${correspondingSpotifyEpisode.duration} \n\n`
        );
      }
    }

    const dbEpisodesByNumber = new Map();
    for (const dbEpisode of allEpisodes) {
      if (!dbEpisode.episode_number) continue;

      const sameNumberEpisodes = dbEpisodesByNumber.get(dbEpisode.episode_number) || [];
      sameNumberEpisodes.push(dbEpisode);
      dbEpisodesByNumber.set(dbEpisode.episode_number, sameNumberEpisodes);
    }

    const dbEpisodeNames = new Set(allEpisodes.map((ep) => ep.full_name));

    for (const spotifyEpisode of spotifyEpisodes) {
      const renamedDbEpisode = findRenamedDbEpisode(spotifyEpisode.name, dbEpisodesByNumber);

      if (renamedDbEpisode) {
        await db.updateEpisodeName(spotifyEpisode.name, renamedDbEpisode.id);

        someEpisodeNameGotUpdated = true;

        console.info(
          ` \n\n spotify updated the name of an episode! \n
                              from: ${renamedDbEpisode.full_name} \n
                              to: ${spotifyEpisode.name} \n\n`
        );

        // the renamed episode already exists in the db under its old name,
        // so it must not also be treated as a new release
        continue;
      }

      if (!dbEpisodeNames.has(spotifyEpisode.name)) {
        console.info(`New episode released: ${spotifyEpisode.name}`);

        await db.insertNewEpisode(spotifyEpisode);
      }
    }

    if (someEpisodeNameGotUpdated) allEpisodes = await db.getAllEpisodes();

    for (const dbEpisode of allEpisodes) {
      if (!spotifyEpisodeNames.has(dbEpisode.full_name)) {
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
  } catch (err) {
    console.warn("Worker failed to run:", err);
  } finally {
    if (client) client.release();
  }
}

// An episode counts as renamed when a db episode with the same episode number
// has a different name, unless either name is a "(Part x)" episode — those
// legitimately share an episode number.
function findRenamedDbEpisode(spotifyEpisodeName, dbEpisodesByNumber) {
  const epNumber = getEpisodeNumber(spotifyEpisodeName);

  if (!epNumber || spotifyEpisodeName.toLowerCase().includes("(part")) return null;

  const candidates = dbEpisodesByNumber.get(epNumber) || [];

  return (
    candidates.find(
      (dbEpisode) =>
        dbEpisode.full_name !== spotifyEpisodeName &&
        !dbEpisode.full_name.toLowerCase().includes("(part")
    ) || null
  );
}

if (require.main === module) {
  refreshDb();
}

module.exports = refreshDb;
