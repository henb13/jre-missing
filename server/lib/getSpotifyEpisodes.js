/* eslint-disable no-undef */
const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

const showId = "4rOoJ6Egrf8K2IrywzwOMk";
async function getSpotifyEpisodes() {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    const tokenData = await spotifyApi.clientCredentialsGrant();
    console.log("The access token expires in " + tokenData.body["expires_in"]);
    spotifyApi.setAccessToken(tokenData.body["access_token"]);

    let spotifyEpisodes = [];
    const episodes = await spotifyApi.getShowEpisodes(showId, {
      market: "US",
      limit: 50,
      offset: spotifyEpisodes.length,
    });

    spotifyEpisodes.push(...episodes.body.items.map(ep => ep.name));

    const totalJreEpisodesOnSpotify = episodes.body.total;

    console.log("Total JRE episodes on Spotify: " + totalJreEpisodesOnSpotify);

    while (spotifyEpisodes.length < totalJreEpisodesOnSpotify) {
      const episodes = await spotifyApi.getShowEpisodes(
        showId,

        { market: "US", limit: 50, offset: spotifyEpisodes.length }
      );
      spotifyEpisodes.push(...episodes.body.items.map(ep => ep.name));
    }
    console.log("episodes gone through: " + spotifyEpisodes.length);

    return spotifyEpisodes;
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = getSpotifyEpisodes;
