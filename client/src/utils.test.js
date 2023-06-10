import { formatMinutesToTimeAmountString } from "./utils";

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
  expect(formatMinutesToTimeAmountString(60 + 1)).toBe("1 hour and 1 minute");
  expect(formatMinutesToTimeAmountString(60 + 59)).toBe("1 hour and 59 minutes");
  expect(formatMinutesToTimeAmountString(60 * 2 + 5)).toBe("2 hours and 5 minutes");
  expect(formatMinutesToTimeAmountString(60 * 5 + 25)).toBe("5 hours and 25 minutes");
  expect(formatMinutesToTimeAmountString(60 * 6 + 1)).toBe("6 hours and 1 minute");
  expect(formatMinutesToTimeAmountString(60 * 6 + 2)).toBe("6 hours and 2 minutes");
});
