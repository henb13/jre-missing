/* eslint-disable no-undef */
const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

const JRE_SHOW_ID = "4rOoJ6Egrf8K2IrywzwOMk";

async function getSpotifyEpisodes() {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    const tokenData = await spotifyApi.clientCredentialsGrant();
    console.info(`The access token expires in ${tokenData.body["expires_in"]}`);
    spotifyApi.setAccessToken(tokenData.body["access_token"]);

    const spotifyEpisodes = [];
    const episodes = await spotifyApi.getShowEpisodes(JRE_SHOW_ID, {
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
      const episodes = await spotifyApi.getShowEpisodes(JRE_SHOW_ID, {
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
    console.error(err.message);
  }
}

module.exports = getSpotifyEpisodes;
