// Matches episodes starting with a number, either with or without preceding hashtag (#)
function getEpisodeNumber(name) {
  return parseInt(name?.match(/^(\d+)|(?<=^#)(\d+)/)) || null;
}

module.exports = getEpisodeNumber;
