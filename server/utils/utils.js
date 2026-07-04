const formatMsToTimeString = (time) => {
  const hours = Math.floor(time / 1000 / 60 / 60);
  const minutesRest = (time / 1000 / 60) % 60;
  const seconds = (time / 1000) % 60;
  return `${Math.floor(hours)} hr ${Math.floor(minutesRest)} min ${Math.floor(seconds)} sec`;
};

module.exports = {
  formatMsToTimeString,
};
