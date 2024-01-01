const express = require("express");
const router = express.Router();
const fs = require("fs");

const mockResponse = JSON.parse(
  fs.readFileSync(`${__dirname}/__mocks__/mockResponse.json`, "utf8")
);

router.get("/api/episodes", async (_, res) => {
  return res.json(mockResponse);

  //TODO: Implement supabase development database if not using mock response
});

module.exports = { devApi: router };
