//TODO: Change to prod domain when ready.
const allowOrigin =
  process.env.NODE_ENV === "development" ? "*" : "https://not-yet-prod-domain.com";

module.exports = (_, res, next) => {
  res.header({
    "cache-control": "max-age=1800",
    "Access-Control-Allow-Origin": allowOrigin,
  });

  next();
};
