/* eslint-disable no-undef */
const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

const JRE_SHOW_ID = "4rOoJ6Egrf8K2IrywzwOMk";
async function getSpotifyEpisodeNames() {
    try {
        const spotifyApi = new SpotifyWebApi({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
        });

        const tokenData = await spotifyApi.clientCredentialsGrant();
        console.log("The access token expires in " + tokenData.body["expires_in"]);
        spotifyApi.setAccessToken(tokenData.body["access_token"]);

        const spotifyEpisodeNames = [];
        const episodes = await spotifyApi.getShowEpisodes(JRE_SHOW_ID, {
            market: "US",
            limit: 50,
            offset: spotifyEpisodeNames.length,
        });

        spotifyEpisodeNames.push(...episodes.body.items.map((ep) => ep.name));

        const totalEpisodes = episodes.body.total;

        console.log("Total JRE episodes on Spotify: " + totalEpisodes);

        while (spotifyEpisodeNames.length < totalEpisodes) {
            const episodes = await spotifyApi.getShowEpisodes(JRE_SHOW_ID, {
                market: "US",
                limit: 50,
                offset: spotifyEpisodeNames.length,
            });
            spotifyEpisodeNames.push(...episodes.body.items.map((ep) => ep.name));
        }
        console.log("episodes gone through: " + spotifyEpisodeNames.length);

        return spotifyEpisodeNames;
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = getSpotifyEpisodeNames;
