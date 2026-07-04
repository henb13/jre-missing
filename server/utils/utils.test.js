/**
 * Characterization tests for server-side formatting utils.
 * TZ is pinned to UTC in jest.setup.js, so date strings are deterministic.
 */

const { formatMsToTimeString, getDateString, getDateTimeHTMLAttribute } = require("./utils");

const NOON_JAN_1_1970 = 12 * 60 * 60 * 1000;

describe("formatMsToTimeString", () => {
  test.each([
    [0, "0 hr 0 min 0 sec"],
    [59999, "0 hr 0 min 59 sec"],
    [3599999, "0 hr 59 min 59 sec"],
    [3600000, "1 hr 0 min 0 sec"],
    [5445000, "1 hr 30 min 45 sec"],
    [7200000, "2 hr 0 min 0 sec"],
  ])("%i ms → %s", (ms, expected) => {
    expect(formatMsToTimeString(ms)).toBe(expected);
  });
});

describe("date formatting", () => {
  test("getDateTimeHTMLAttribute formats as yyyy-MM-dd", () => {
    expect(getDateTimeHTMLAttribute(NOON_JAN_1_1970)).toBe("1970-01-01");
  });

  test("getDateString formats as a long localized date", () => {
    expect(getDateString(NOON_JAN_1_1970)).toMatch(/^January 1(st)?, 1970$/);
  });
});
