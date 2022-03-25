const getEpisodeNumber = require("./getEpisodeNumber");

describe("Return number from regular episode title where the episode name starts with the number", () => {
    test("Return number when hashtag precedes number (i.e. #42)", () => {
        expect(getEpisodeNumber("#1789 - Tom Papa")).toEqual(1789);
    });

    test("Return number when no hashtag precedes number", () => {
        expect(getEpisodeNumber("32 - Duncan Trussell")).toEqual(32);
    });
});

describe("Do not return episode number when the episode name do not start with a number", () => {
    test("return null when episode number is not at the beginning of the title", () => {
        expect(getEpisodeNumber("JRE #1789 - Tom Papa")).toBeNull();
        expect(getEpisodeNumber("JRE 1789 - Tom Papa")).toBeNull();
        expect(getEpisodeNumber("Fight Companion #32 - Joey Diaz")).toBeNull();
    });

    test("return null when there is no episode number in the title", () => {
        expect(getEpisodeNumber("Fight Companion - February 19, 2017 (Part 2")).toBeNull();
    });
});

describe("Is type of number", () => {
    test("return a number and not a string when episode name start with an episode number", () => {
        expect(typeof getEpisodeNumber("#1789 - Tom Papa")).toBe("number");
    });
});
