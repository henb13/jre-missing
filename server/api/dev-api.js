const express = require("express");
const router = express.Router();
const fs = require("fs");

const mockResponse = JSON.parse(
  fs.readFileSync(`${__dirname}/__mocks__/mockResponse.json`, "utf8")
);

router.get("/api/episodes", async (_, res) => {
  return res.json(
    mockResponse.missingEpisodes.sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (b.isNew && !a.isNew) return 1;
      return 0;
    })
  );

  //TODO: Implement supabase development database if not using mock response
});

const mapMissingEpisodes = (missingEpisodes) => {
  return missingEpisodes
    .map((ep) => {
      const { full_name, episode_number, date_removed } = ep;
      const ms = parseInt(date_removed);

      return {
        full_name,
        episode_number,
        isNew: getIsEpisodeNewlyReleased(ms),
        date: ms
          ? {
              ms,
              formatted: getDateString(ms),
              htmlAttribute: getDateTimeHTMLAttribute(ms),
            }
          : null,
      };
    })
    .sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (b.isNew && !a.isNew) return 1;
      return 0;
    });
};

module.exports = { devApi: router };
