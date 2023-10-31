const express = require("express");
const router = express.Router();
const fs = require("fs");

const mockResponse = JSON.parse(fs.readFileSync("data.json", "utf8"));

router.use(express.json());
require("dotenv").config();

router.get("/api/episodes", async (_, res) => {
  return res.json(mockResponse);

  //TODO: Implement supabase if not using mock response
});

module.exports = router;
