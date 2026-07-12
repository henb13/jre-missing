import { formatMinutesToTimeAmountString, sortEpisodes, filterEpisodes } from "./utils";

describe("get correct timestring given a minute amount as input", () => {
  test("return 'less than a minute ago'", () => {
    expect(formatMinutesToTimeAmountString(0)).toBe("less than a minute ago");
    expect(formatMinutesToTimeAmountString(0.5)).toBe("less than a minute ago");
  });

  test("return minutes", () => {
    expect(formatMinutesToTimeAmountString(1)).toBe("1 minute");
    expect(formatMinutesToTimeAmountString(30)).toBe("30 minutes");
    expect(formatMinutesToTimeAmountString(59)).toBe("59 minutes");
  });

  test("return hours", () => {
    expect(formatMinutesToTimeAmountString(60)).toBe("1 hour");
    expect(formatMinutesToTimeAmountString(60 * 2)).toBe("2 hours");
    expect(formatMinutesToTimeAmountString(60 * 23)).toBe("23 hours");
  });

  test("return days", () => {
    expect(formatMinutesToTimeAmountString(60 * 24)).toBe("1 day");
    expect(formatMinutesToTimeAmountString(60 * 24 * 2)).toBe("2 days");
    expect(formatMinutesToTimeAmountString(60 * 24 * 3)).toBe("3 days");
    expect(formatMinutesToTimeAmountString(60 * 24 * 76)).toBe("76 days");
  });
});

describe("get correct minutes addition to time string when returning hours (i.e. '2 hours and 5 minutes')", () => {
  test("return hours and minutes", () => {
    expect(formatMinutesToTimeAmountString(60 + 1)).toBe("1 hour and 1 minute");
    expect(formatMinutesToTimeAmountString(60 + 59)).toBe("1 hour and 59 minutes");
    expect(formatMinutesToTimeAmountString(60 * 2 + 5)).toBe("2 hours and 5 minutes");
    expect(formatMinutesToTimeAmountString(60 * 5 + 25)).toBe("5 hours and 25 minutes");
    expect(formatMinutesToTimeAmountString(60 * 6 + 1)).toBe("6 hours and 1 minute");
    expect(formatMinutesToTimeAmountString(60 * 6 + 2)).toBe("6 hours and 2 minutes");
  });
});

describe("sortEpisodes", () => {
  const episodes = [
    { episode_number: 100, date: { ms: 300 }, changes: [{ date: { ms: 30 } }] },
    { episode_number: 300, date: null, changes: [{ date: { ms: 10 } }] },
    { episode_number: 200, date: { ms: 100 }, changes: [{ date: { ms: 20 } }] },
    { episode_number: null, date: { ms: 200 }, changes: [{ date: { ms: 40 } }] },
  ];

  test("sorts by episode number descending by default, nulls last", () => {
    const sorted = sortEpisodes(episodes, { name: "episode number", reverse: false });
    expect(sorted.map((ep) => ep.episode_number)).toEqual([300, 200, 100, null]);
  });

  test("reverse sorts ascending, nulls still last", () => {
    const sorted = sortEpisodes(episodes, { name: "episode number", reverse: true });
    expect(sorted.map((ep) => ep.episode_number)).toEqual([100, 200, 300, null]);
  });

  test("sorts by date removed, episodes without date last", () => {
    const sorted = sortEpisodes(episodes, { name: "date removed", reverse: false });
    expect(sorted.map((ep) => ep.date?.ms ?? null)).toEqual([300, 200, 100, null]);
  });

  test("sorts by date shortened using the latest change", () => {
    const sorted = sortEpisodes(episodes, { name: "date shortened", reverse: false });
    expect(sorted.map((ep) => ep.changes[0].date.ms)).toEqual([40, 30, 20, 10]);
  });

  test("does not mutate the input array", () => {
    const input = [...episodes];
    sortEpisodes(input, { name: "episode number", reverse: false });
    expect(input).toEqual(episodes);
  });
});

describe("filterEpisodes", () => {
  const episodes = [
    { full_name: "#1169 - Elon Musk" },
    { full_name: "#1006 - Jordan Peterson" },
    { full_name: "Fight Companion - August 2018" },
  ];

  test("filters case-insensitively on full name", () => {
    expect(filterEpisodes(episodes, "elon")).toEqual([episodes[0]]);
    expect(filterEpisodes(episodes, "COMPANION")).toEqual([episodes[2]]);
  });

  test("returns all episodes for empty search", () => {
    expect(filterEpisodes(episodes, "")).toEqual(episodes);
  });
});
