module.exports = (req, res, next) => {
  // read env inside the handler so it works regardless of dotenv load order
  const isDev = process.env.NODE_ENV === "development";
  const allowOrigin = isDev ? "*" : process.env.ALLOWED_ORIGIN;
  const maxAge = isDev ? "0" : "1800";

  res.header("cache-control", `max-age=${maxAge}, must-revalidate, stale-if-error`);

  if (allowOrigin) {
    res.header("Access-Control-Allow-Origin", allowOrigin);
  }

  next();
};
