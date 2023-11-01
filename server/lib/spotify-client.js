const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

const spotifyClient = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

module.exports = { spotifyClient };
