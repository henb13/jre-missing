const express = require("express");
const router = express.Router();
const { mockResponse } = require("./__mocks__/mockResponse");

router.use(express.json());
require("dotenv").config();

router.get("/api/episodes", async (_, res) => {
  res.header({
    "Access-Control-Allow-Origin": "http://localhost:3000",
  });

  return res.json(mockResponse);

  //TODO: Implement dev database
});

module.exports = router;
