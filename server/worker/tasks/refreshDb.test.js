/**
 * Characterization tests for refreshDb.
 * These pin the CURRENT behavior of the worker (including known bugs, marked as such)
 * so future refactors can prove they only change what they intend to change.
 */

const mockClient = { release: jest.fn() };
const mockDb = {
  getAllEpisodes: jest.fn(),
  getMissingEpisodes: jest.fn(),
  getShortenedEpisodes: jest.fn(),
  insertNewEpisode: jest.fn(),
  updateEpisodeName: jest.fn(),
  updateEpisodeDuration: jest.fn(),
  setSpotifyStatus: jest.fn(),
  setLastCheckedNow: jest.fn(),
  getLastChecked: jest.fn(),
};

jest.mock("pg", () => ({
  Pool: jest.fn(() => ({ connect: jest.fn(async () => mockClient) })),
}));
jest.mock("../../db/db", () => jest.fn(() => mockDb));
jest.mock("../../lib/getSpotifyEpisodes");

const getSpotifyEpisodes = require("../../lib/getSpotifyEpisodes");
const refreshDb = require("./refreshDb");

const dbEpisode = (overrides = {}) => ({
  id: 1,
  episode_number: 100,
  full_name: "#100 - Guest",
  on_spotify: true,
  duration: 1000,
  ...overrides,
});

const spotifyEpisode = (overrides = {}) => ({
  name: "#100 - Guest",
  duration: 1000,
  ...overrides,
});

beforeAll(() => {
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

beforeEach(() => {
  for (const fn of Object.values(mockDb)) fn.mockReset();
  getSpotifyEpisodes.mockReset();
  mockClient.release.mockClear();
  console.warn.mockClear();

  mockDb.getAllEpisodes.mockResolvedValue([]);
  getSpotifyEpisodes.mockResolvedValue([]);
});

describe("new releases", () => {
  test("episode on Spotify but not in db gets inserted", async () => {
    const newEp = spotifyEpisode({ name: "#2000 - New Guest", duration: 5000 });
    getSpotifyEpisodes.mockResolvedValue([newEp]);
    mockDb.getAllEpisodes.mockResolvedValue([]);

    await refreshDb();

    expect(mockDb.insertNewEpisode).toHaveBeenCalledTimes(1);
    expect(mockDb.insertNewEpisode).toHaveBeenCalledWith(newEp);
  });

  test("episode already in db is not re-inserted", async () => {
    getSpotifyEpisodes.mockResolvedValue([spotifyEpisode()]);
    mockDb.getAllEpisodes.mockResolvedValue([dbEpisode()]);

    await refreshDb();

    expect(mockDb.insertNewEpisode).not.toHaveBeenCalled();
  });
});

describe("removed / re-added episodes", () => {
  test("db episode absent from Spotify gets marked as removed", async () => {
    const ep = dbEpisode({ on_spotify: true });
    getSpotifyEpisodes.mockResolvedValue([]);
    mockDb.getAllEpisodes.mockResolvedValue([ep]);

    await refreshDb();

    expect(mockDb.setSpotifyStatus).toHaveBeenCalledTimes(1);
    expect(mockDb.setSpotifyStatus).toHaveBeenCalledWith(ep, false);
  });

  test("already-removed episode absent from Spotify is not updated again", async () => {
    getSpotifyEpisodes.mockResolvedValue([]);
    mockDb.getAllEpisodes.mockResolvedValue([dbEpisode({ on_spotify: false })]);

    await refreshDb();

    expect(mockDb.setSpotifyStatus).not.toHaveBeenCalled();
  });

  test("removed episode that reappears on Spotify gets marked as re-added", async () => {
    const ep = dbEpisode({ on_spotify: false });
    getSpotifyEpisodes.mockResolvedValue([spotifyEpisode()]);
    mockDb.getAllEpisodes.mockResolvedValue([ep]);

    await refreshDb();

    expect(mockDb.setSpotifyStatus).toHaveBeenCalledTimes(1);
    expect(mockDb.setSpotifyStatus).toHaveBeenCalledWith(ep, true);
  });

  test("episode present on Spotify and on_spotify=true is left alone", async () => {
    getSpotifyEpisodes.mockResolvedValue([spotifyEpisode()]);
    mockDb.getAllEpisodes.mockResolvedValue([dbEpisode()]);

    await refreshDb();

    expect(mockDb.setSpotifyStatus).not.toHaveBeenCalled();
  });
});

describe("durations", () => {
  test("missing duration in db gets filled from Spotify", async () => {
    getSpotifyEpisodes.mockResolvedValue([spotifyEpisode({ duration: 555 })]);
    mockDb.getAllEpisodes.mockResolvedValue([dbEpisode({ duration: null })]);

    await refreshDb();

    expect(mockDb.updateEpisodeDuration).toHaveBeenCalledTimes(1);
    expect(mockDb.updateEpisodeDuration).toHaveBeenCalledWith(555, 1);
  });

  test("changed duration gets updated", async () => {
    getSpotifyEpisodes.mockResolvedValue([spotifyEpisode({ duration: 900 })]);
    mockDb.getAllEpisodes.mockResolvedValue([dbEpisode({ duration: 1000 })]);

    await refreshDb();

    expect(mockDb.updateEpisodeDuration).toHaveBeenCalledTimes(1);
    expect(mockDb.updateEpisodeDuration).toHaveBeenCalledWith(900, 1);
  });

  test("unchanged duration is not updated", async () => {
    getSpotifyEpisodes.mockResolvedValue([spotifyEpisode({ duration: 1000 })]);
    mockDb.getAllEpisodes.mockResolvedValue([dbEpisode({ duration: 1000 })]);

    await refreshDb();

    expect(mockDb.updateEpisodeDuration).not.toHaveBeenCalled();
  });
});

describe("renamed episodes", () => {
  const renamedSetup = () => {
    const oldEp = dbEpisode({
      id: 7,
      episode_number: 1789,
      full_name: "#1789 - Tom Pape",
      duration: 100,
    });
    const renamed = spotifyEpisode({ name: "#1789 - Tom Papa", duration: 100 });

    getSpotifyEpisodes.mockResolvedValue([renamed]);
    mockDb.getAllEpisodes
      .mockResolvedValueOnce([oldEp])
      .mockResolvedValueOnce([{ ...oldEp, full_name: renamed.name }]);

    return { oldEp, renamed };
  };

  test("same episode number with different name gets renamed to the Spotify name", async () => {
    const { renamed } = renamedSetup();

    await refreshDb();

    expect(mockDb.updateEpisodeName).toHaveBeenCalledTimes(1);
    expect(mockDb.updateEpisodeName).toHaveBeenCalledWith(renamed.name, 7);
  });

  test("rename triggers a refetch of all episodes before the removed/re-added pass", async () => {
    renamedSetup();

    await refreshDb();

    expect(mockDb.getAllEpisodes).toHaveBeenCalledTimes(2);
    // the refetched (renamed) episode is found on Spotify, so no status flip
    expect(mockDb.setSpotifyStatus).not.toHaveBeenCalled();
  });

  test("KNOWN BUG (pinned): a rename also inserts the episode again as a 'new release', creating a duplicate row", async () => {
    // The in-memory allEpisodes list is stale after updateEpisodeName, so the
    // isNewRelease check does not find the new name and inserts a duplicate.
    // Fix planned: skip the new-release check for the episode that was just renamed.
    const { renamed } = renamedSetup();

    await refreshDb();

    expect(mockDb.insertNewEpisode).toHaveBeenCalledTimes(1);
    expect(mockDb.insertNewEpisode).toHaveBeenCalledWith(renamed);
  });

  test("episodes with '(part' in the name are never treated as renames", async () => {
    const part1 = dbEpisode({ full_name: "#100 - Guest (Part 1)" });
    getSpotifyEpisodes.mockResolvedValue([spotifyEpisode({ name: "#100 - Guest (Part 2)" })]);
    mockDb.getAllEpisodes.mockResolvedValue([part1]);

    await refreshDb();

    expect(mockDb.updateEpisodeName).not.toHaveBeenCalled();
    // Part 2 is a genuinely different episode: inserted as new
    expect(mockDb.insertNewEpisode).toHaveBeenCalledTimes(1);
    // and Part 1 is no longer on Spotify in this scenario: marked removed
    expect(mockDb.setSpotifyStatus).toHaveBeenCalledWith(part1, false);
  });

  test("episodes without an episode number are never treated as renames", async () => {
    const noNumber = dbEpisode({
      episode_number: null,
      full_name: "Fight Companion - February 19, 2017",
    });
    getSpotifyEpisodes.mockResolvedValue([
      spotifyEpisode({ name: "Fight Companion - February 20, 2017" }),
    ]);
    mockDb.getAllEpisodes.mockResolvedValue([noNumber]);

    await refreshDb();

    expect(mockDb.updateEpisodeName).not.toHaveBeenCalled();
    expect(mockDb.insertNewEpisode).toHaveBeenCalledTimes(1);
  });
});

describe("bookkeeping and error handling", () => {
  test("last_checked is updated after a successful run", async () => {
    await refreshDb();

    expect(mockDb.setLastCheckedNow).toHaveBeenCalledTimes(1);
    expect(mockClient.release).toHaveBeenCalledTimes(1);
  });

  test("a run with no changes performs no writes besides last_checked", async () => {
    getSpotifyEpisodes.mockResolvedValue([spotifyEpisode()]);
    mockDb.getAllEpisodes.mockResolvedValue([dbEpisode()]);

    await refreshDb();

    expect(mockDb.insertNewEpisode).not.toHaveBeenCalled();
    expect(mockDb.updateEpisodeName).not.toHaveBeenCalled();
    expect(mockDb.updateEpisodeDuration).not.toHaveBeenCalled();
    expect(mockDb.setSpotifyStatus).not.toHaveBeenCalled();
    expect(mockDb.setLastCheckedNow).toHaveBeenCalledTimes(1);
  });

  test("Spotify failure is swallowed: no throw, no db writes, client still released", async () => {
    getSpotifyEpisodes.mockRejectedValue(new Error("spotify down"));

    await expect(refreshDb()).resolves.toBeUndefined();

    expect(mockDb.getAllEpisodes).not.toHaveBeenCalled();
    expect(mockDb.setLastCheckedNow).not.toHaveBeenCalled();
    expect(mockClient.release).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith("Worker failed to run: spotify down");
  });

  test("db failure mid-run is swallowed and the client is still released", async () => {
    mockDb.getAllEpisodes.mockRejectedValue(new Error("db down"));

    await expect(refreshDb()).resolves.toBeUndefined();

    expect(mockDb.setLastCheckedNow).not.toHaveBeenCalled();
    expect(mockClient.release).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith("Worker failed to run: db down");
  });
});
