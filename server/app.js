const express = require("express");
const app = express();
const api = require("./api/index.js");
const devApi = require("./api/dev-api.js");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const helmet = require("helmet");
require("dotenv").config();

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3001;
const useDevApi =
  process.env.NODE_ENV === "development" && process.env.USE_MOCK_DATA === "true";

app.set("trust proxy", 1);

const rateLimiter = rateLimit({
  windowMs: 15 * 1000,
  max: 7,
});

const speedLimiter = slowDown({
  windowMs: 15 * 1000,
  delayAfter: 3,
  delayMs: (hits) => hits * 100,
});

app.use(express.json());
app.use(helmet());
app.use(rateLimiter);
app.use(speedLimiter);
app.use(useDevApi ? devApi : api);

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});

module.exports = app;
