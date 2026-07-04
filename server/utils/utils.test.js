const { formatMsToTimeString } = require("./utils");

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
