const express = require("express");
const app = express();
const responseHeaders = require("./api/middlewares/response-headers.js");
const errorHandler = require("./api/middlewares/error-handler.js");
const { devApi, api } = require("./api");

const helmet = require("helmet");
require("dotenv").config();

const port = process.env.PORT || 3001;
const useDevApi =
  process.env.NODE_ENV === "development" && process.env.USE_MOCK_DATA === "true";

app.set("trust proxy", 1);

app.use(express.json());
app.use(helmet());

app.use(responseHeaders);
app.use(useDevApi ? devApi : api);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
