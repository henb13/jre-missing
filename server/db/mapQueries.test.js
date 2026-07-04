/**
 * Characterization tests for the row-mapping functions used by the API queries.
 * Dates are returned as { ms } only; the client formats them in the user's timezone.
 */

const { mapMissingEpisodes, mapShortenedEpisodes, mapLastChecked } = require("./mapQueries");

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (days) => String(Date.now() - days * DAY_MS);

describe("mapMissingEpisodes", () => {
  test("episode without a removal date maps to date: null and isNew: false", () => {
    const [ep] = mapMissingEpisodes([
      { full_name: "Fight Companion", episode_number: null, date_removed: null },
    ]);

    expect(ep).toEqual({
      full_name: "Fight Companion",
      episode_number: null,
      isNew: false,
      date: null,
    });
  });

  test("episode removed recently is marked isNew with the removal time in ms", () => {
    const removedMs = Date.now() - 2 * DAY_MS;
    const [ep] = mapMissingEpisodes([
      { full_name: "#100 - Guest", episode_number: 100, date_removed: String(removedMs) },
    ]);

    expect(ep.isNew).toBe(true);
    expect(ep.date).toEqual({ ms: removedMs });
  });

  test("isNew threshold is 14 days: 13.5 days ago is new, 15 days ago is not", () => {
    const [recent, old] = mapMissingEpisodes([
      { full_name: "A", episode_number: 1, date_removed: daysAgo(13.5) },
      { full_name: "B", episode_number: 2, date_removed: daysAgo(15) },
    ]);

    expect(recent.isNew).toBe(true);
    expect(old.isNew).toBe(false);
  });
});

describe("mapShortenedEpisodes", () => {
  // rows arrive ordered by date_changed DESC (newest first), as the SQL query returns them
  const row = (overrides = {}) => ({
    id: 5,
    episode_number: 100,
    full_name: "#100 - Guest",
    date_changed: daysAgo(1),
    old_duration: 7200000,
    new_duration: 3000000,
    ...overrides,
  });

  test("a shortened episode is included with formatted durations", () => {
    const result = mapShortenedEpisodes([row()]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 5,
      episode_number: 100,
      full_name: "#100 - Guest",
      isNew: true,
      isOriginalLength: false,
    });
    expect(result[0].changes).toEqual([
      {
        date: { ms: expect.any(Number) },
        old_duration_string: "2 hr 0 min 0 sec",
        new_duration_string: "0 hr 50 min 0 sec",
      },
    ]);
  });

  test("an episode whose duration only ever increased is filtered out", () => {
    const result = mapShortenedEpisodes([
      row({ old_duration: 3000000, new_duration: 7200000 }),
    ]);

    expect(result).toEqual([]);
  });

  test("multiple changes for the same episode are grouped, newest first", () => {
    const result = mapShortenedEpisodes([
      row({ date_changed: daysAgo(1), old_duration: 3000000, new_duration: 2000000 }),
      row({ date_changed: daysAgo(10), old_duration: 7200000, new_duration: 3000000 }),
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].changes).toHaveLength(2);
    expect(result[0].changes[0].old_duration_string).toBe("0 hr 50 min 0 sec");
    expect(result[0].changes[1].old_duration_string).toBe("2 hr 0 min 0 sec");
  });

  test("an episode shortened and later restored is marked isOriginalLength", () => {
    const result = mapShortenedEpisodes([
      // newest: restored back to 2 hr
      row({ date_changed: daysAgo(1), old_duration: 3000000, new_duration: 7200000 }),
      // oldest: shortened from 2 hr
      row({ date_changed: daysAgo(10), old_duration: 7200000, new_duration: 3000000 }),
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].isOriginalLength).toBe(true);
  });

  test("different episodes are not grouped together", () => {
    const result = mapShortenedEpisodes([
      row({ id: 5 }),
      row({ id: 9, full_name: "#200 - Other" }),
    ]);

    expect(result).toHaveLength(2);
    expect(result.map((ep) => ep.id)).toEqual([5, 9]);
  });

  test("numeric duration fields are stripped from the change items", () => {
    const [ep] = mapShortenedEpisodes([row()]);

    expect(Object.keys(ep.changes[0]).sort()).toEqual([
      "date",
      "new_duration_string",
      "old_duration_string",
    ]);
  });
});

describe("mapLastChecked", () => {
  test("returns the epoch ms as a number", () => {
    expect(mapLastChecked([{ miliseconds: "1700000000000" }])).toBe(1700000000000);
  });

  test("KNOWN QUIRK (pinned): returns NaN when the log table is empty", () => {
    expect(Number.isNaN(mapLastChecked([]))).toBe(true);
  });
});
