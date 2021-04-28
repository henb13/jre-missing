const express = require("express");
const app = express();
const api = require("./api/index.js");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const helmet = require("helmet");
require("dotenv").config();

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3001;

app.set("trust proxy", 1);

const rateLimiter = rateLimit({
  windowMs: 15 * 1000,
  max: 7,
});

const speedLimiter = slowDown({
  windowMs: 15 * 1000,
  delayAfter: 3,
  delayMs: 250,
});

app.use(express.json());
app.use(helmet());
app.use(rateLimiter);
app.use(speedLimiter);
app.use(api);

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});

module.exports = app;
