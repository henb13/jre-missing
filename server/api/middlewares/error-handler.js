module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong on the server. Please try again later.");
  next();
};
