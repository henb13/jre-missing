import formatMinutesToTimeString from "./formatMinutesToTimeString";

describe("get correct timestring given a minute amount as input", () => {
  test("return 'less than a minute ago'", () => {
    expect(formatMinutesToTimeString(0)).toBe("less than a minute ago");
    expect(formatMinutesToTimeString(0.5)).toBe("less than a minute ago");
  });

  test("return minutes", () => {
    expect(formatMinutesToTimeString(1)).toBe("1 minute ago");
    expect(formatMinutesToTimeString(30)).toBe("30 minutes ago");
    expect(formatMinutesToTimeString(59)).toBe("59 minutes ago");
  });

  test("return hours", () => {
    expect(formatMinutesToTimeString(60)).toBe("1 hour ago");
    expect(formatMinutesToTimeString(60 * 2)).toBe("2 hours ago");
    expect(formatMinutesToTimeString(60 * 23)).toBe("23 hours ago");
  });

  test("return days", () => {
    expect(formatMinutesToTimeString(60 * 24)).toBe("1 day ago");
    expect(formatMinutesToTimeString(60 * 24 * 2)).toBe("2 days ago");
    expect(formatMinutesToTimeString(60 * 24 * 3)).toBe("3 days ago");
    expect(formatMinutesToTimeString(60 * 24 * 76)).toBe("76 days ago");
  });
});

describe("get correct minutes addition to time string when returning hours (i.e. '2 hours and 5 minutes ago')", () => {
  expect(formatMinutesToTimeString(60 + 1)).toBe("1 hour and 1 minute ago");
  expect(formatMinutesToTimeString(60 + 59)).toBe("1 hour and 59 minutes ago");
  expect(formatMinutesToTimeString(60 * 2 + 5)).toBe("2 hours and 5 minutes ago");
  expect(formatMinutesToTimeString(60 * 5 + 25)).toBe("5 hours and 25 minutes ago");
  expect(formatMinutesToTimeString(60 * 6 + 1)).toBe("6 hours and 1 minute ago");
  expect(formatMinutesToTimeString(60 * 6 + 2)).toBe("6 hours and 2 minutes ago");
});
