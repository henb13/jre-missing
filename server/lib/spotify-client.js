const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE_URL = "https://api.spotify.com/v1";

// Minimal Spotify Web API client (replaces the unmaintained spotify-web-api-node).
// Responses are wrapped in { body } to keep the same interface.
let accessToken = null;

const spotifyClient = {
  async clientCredentialsGrant() {
    const credentials = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");

    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!res.ok) {
      throw new Error(`Spotify token request failed with status ${res.status}`);
    }

    return { body: await res.json() };
  },

  setAccessToken(token) {
    accessToken = token;
  },

  async getShowEpisodes(showId, { market, limit, offset }) {
    const params = new URLSearchParams({ market, limit, offset });
    const res = await fetch(`${API_BASE_URL}/shows/${showId}/episodes?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      throw new Error(`Spotify episodes request failed with status ${res.status}`);
    }

    return { body: await res.json() };
  },
};

module.exports = { spotifyClient };
