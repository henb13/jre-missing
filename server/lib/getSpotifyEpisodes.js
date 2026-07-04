const { spotifyClient } = require("./spotify-client");

const JRE_SHOW_ID = "4rOoJ6Egrf8K2IrywzwOMk";
const PAGE_SIZE = 50;

async function getSpotifyEpisodes() {
  try {
    const data = await spotifyClient.clientCredentialsGrant();
    spotifyClient.setAccessToken(data.body["access_token"]);

    console.info(`Started fetching episodes from Spotify at ${new Date().toString()}`);

    const spotifyEpisodes = [];
    let totalEpisodes;

    do {
      const episodes = await spotifyClient.getShowEpisodes(JRE_SHOW_ID, {
        market: "US",
        limit: PAGE_SIZE,
        offset: spotifyEpisodes.length,
      });

      totalEpisodes = episodes.body.total;

      // abort instead of looping forever; a partial list would falsely mark
      // the remaining episodes as removed
      if (!episodes.body.items.length && spotifyEpisodes.length < totalEpisodes) {
        throw new Error(
          `Spotify returned an empty page at offset ${spotifyEpisodes.length} of ${totalEpisodes} total episodes`
        );
      }

      spotifyEpisodes.push(
        ...episodes.body.items.map((ep) => {
          return { name: ep.name, duration: ep.duration_ms };
        })
      );
    } while (spotifyEpisodes.length < totalEpisodes);

    console.log(
      `${spotifyEpisodes.length} out of ${totalEpisodes} JRE episodes on Spotify successfully fetched`
    );

    return spotifyEpisodes;
  } catch (err) {
    throw new Error(`something went wrong fetching from Spotify: ${err.message}`, {
      cause: err,
    });
  }
}

module.exports = getSpotifyEpisodes;
