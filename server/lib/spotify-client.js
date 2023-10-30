const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

async function initializeSpotifyClient() {
  try {
    const spotifyClient = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    const data = await spotifyClient.clientCredentialsGrant();
    const accessToken = data.body["access_token"];
    const refreshToken = data.body["refresh_token"];
    const expiresIn = data.body["expires_in"];

    spotifyClient.setAccessToken(accessToken);
    spotifyClient.setRefreshToken(refreshToken);

    setInterval(async () => {
      const data = await spotifyClient.refreshAccessToken();
      const accessToken = data.body["access_token"];
      spotifyClient.setAccessToken(accessToken);

      console.log("The access token has been refreshed!");
    }, expiresIn - 60 * 1000);

    spotifyClient.setAccessToken(data.body["access_token"]);
  } catch (error) {
    return null;
  }
}

module.exports = { initializeSpotifyClient };
