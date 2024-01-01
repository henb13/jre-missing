const { spotifyClient } = require("./spotify-client");

const JRE_SHOW_ID = "4rOoJ6Egrf8K2IrywzwOMk";

async function getSpotifyEpisodes() {
  try {
    const data = await spotifyClient.clientCredentialsGrant();
    const accessToken = data.body["access_token"];
    spotifyClient.setAccessToken(accessToken);

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
