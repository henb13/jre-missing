const { spotifyClient } = require("./spotify-client");

const JRE_SHOW_ID = "4rOoJ6Egrf8K2IrywzwOMk";

async function getSpotifyEpisodes() {
  try {
    const data = await spotifyClient.clientCredentialsGrant();
    const accessToken = data.body["access_token"];
    spotifyClient.setAccessToken(accessToken);
    //TODO: Check if access token expired.

    const spotifyEpisodes = [];
    const episodes = await spotifyClient.getShowEpisodes(JRE_SHOW_ID, {
      market: "US",
      limit: 50,
      offset: spotifyEpisodes.length,
    });

    console.info(`Started fetching episodes from Spotify at ${new Date().toString()}`);

    spotifyEpisodes.push(
      ...episodes.body.items.map((ep) => {
        return { name: ep.name, duration: ep.duration_ms };
      })
    );

    const totalEpisodes = episodes.body.total;

    while (spotifyEpisodes.length < totalEpisodes) {
      const episodes = await spotifyClient.getShowEpisodes(JRE_SHOW_ID, {
        market: "US",
        limit: 50,
        offset: spotifyEpisodes.length,
      });

      // abort instead of looping forever; a partial list would falsely mark
      // the remaining episodes as removed
      if (!episodes.body.items.length) {
        throw new Error(
          `Spotify returned an empty page at offset ${spotifyEpisodes.length} of ${totalEpisodes} total episodes`
        );
      }

      spotifyEpisodes.push(
        ...episodes.body.items.map((ep) => {
          return { name: ep.name, duration: ep.duration_ms };
        })
      );
    }

    console.log(
      `${spotifyEpisodes.length} out of ${totalEpisodes} JRE episodes on Spotify successfully fetched`
    );

    return spotifyEpisodes;
  } catch (err) {
    throw new Error(`something went wrong fetching from Spotify: ${err.message}`);
  }
}

module.exports = getSpotifyEpisodes;
