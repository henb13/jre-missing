/**
 * Characterization tests for getSpotifyEpisodes (Spotify fetching + pagination).
 * Known bug, noted but deliberately NOT tested (it would hang the suite): if Spotify
 * ever returns an empty page while total > fetched, the while loop never terminates.
 */

jest.mock("./spotify-client", () => ({
  spotifyClient: {
    clientCredentialsGrant: jest.fn(),
    setAccessToken: jest.fn(),
    getShowEpisodes: jest.fn(),
  },
}));

const { spotifyClient } = require("./spotify-client");
const getSpotifyEpisodes = require("./getSpotifyEpisodes");

const JRE_SHOW_ID = "4rOoJ6Egrf8K2IrywzwOMk";

const mockShowWithTotal = (total) => {
  spotifyClient.getShowEpisodes.mockImplementation(async (showId, { offset, limit }) => ({
    body: {
      total,
      items: Array.from({ length: Math.min(limit, total - offset) }, (_, i) => ({
        name: `#${offset + i} - Guest`,
        duration_ms: 1000 + offset + i,
        release_date: "2024-01-01",
      })),
    },
  }));
};

beforeAll(() => {
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

beforeEach(() => {
  spotifyClient.clientCredentialsGrant.mockReset();
  spotifyClient.setAccessToken.mockReset();
  spotifyClient.getShowEpisodes.mockReset();

  spotifyClient.clientCredentialsGrant.mockResolvedValue({
    body: { access_token: "token-abc" },
  });
});

test("authenticates with client credentials and sets the access token", async () => {
  mockShowWithTotal(10);

  await getSpotifyEpisodes();

  expect(spotifyClient.clientCredentialsGrant).toHaveBeenCalledTimes(1);
  expect(spotifyClient.setAccessToken).toHaveBeenCalledWith("token-abc");
});

test("fetches all pages of 50 until total is reached", async () => {
  mockShowWithTotal(120);

  const episodes = await getSpotifyEpisodes();

  expect(episodes).toHaveLength(120);
  expect(spotifyClient.getShowEpisodes).toHaveBeenCalledTimes(3);

  const calls = spotifyClient.getShowEpisodes.mock.calls;
  expect(calls.map(([, opts]) => opts.offset)).toEqual([0, 50, 100]);
  for (const [showId, opts] of calls) {
    expect(showId).toBe(JRE_SHOW_ID);
    expect(opts).toMatchObject({ market: "US", limit: 50 });
  }
});

test("a single page suffices when total fits in one request", async () => {
  mockShowWithTotal(30);

  const episodes = await getSpotifyEpisodes();

  expect(episodes).toHaveLength(30);
  expect(spotifyClient.getShowEpisodes).toHaveBeenCalledTimes(1);
});

test("maps episodes to { name, duration } only", async () => {
  mockShowWithTotal(1);

  const episodes = await getSpotifyEpisodes();

  expect(episodes[0]).toEqual({ name: "#0 - Guest", duration: 1000 });
});

test("auth failure is wrapped in a descriptive error", async () => {
  spotifyClient.clientCredentialsGrant.mockRejectedValue(new Error("bad creds"));

  await expect(getSpotifyEpisodes()).rejects.toThrow(
    "something went wrong fetching from Spotify: bad creds"
  );
});

test("fetch failure is wrapped in a descriptive error", async () => {
  spotifyClient.getShowEpisodes.mockRejectedValue(new Error("rate limited"));

  await expect(getSpotifyEpisodes()).rejects.toThrow(
    "something went wrong fetching from Spotify: rate limited"
  );
});
