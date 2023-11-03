//TODO: Change to prod domain when ready.
const isDev = process.env.NODE_ENV === "development";
const allowOrigin = isDev ? "*" : "https://not-yet-prod-domain.com";
const maxAge = isDev ? "0" : "1800";

module.exports = (req, res, next) => {
  res.header({
    "cache-control": `max-age=${maxAge}, must-revalidate, stale-if-error`,
    "Access-Control-Allow-Origin": allowOrigin,
  });

  next();
};
