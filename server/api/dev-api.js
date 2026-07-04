const express = require("express");
const router = express.Router();
const fs = require("fs");

const mockResponse = JSON.parse(
  fs.readFileSync(`${__dirname}/__mocks__/mockResponse.json`, "utf8")
);

// same response shape as the real api: { missingEpisodes, shortenedEpisodes, lastCheckedInMs }
router.get("/api/episodes", (_, res) => {
  res.json(mockResponse);
});

module.exports = { devApi: router };
