export default function formatMinutesToTimeString(minutes) {
  if (minutes < 1) {
    return "less than a minute ago";
  }

  if (minutes < 60) {
    const minutesString = setPlurality("minute", minutes);
    return `${minutes} ${minutesString} ago`;
  }
  if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const hoursString = setPlurality("hour", hours);
    const minutesRest = minutes % 60;
    const minutesString = setPlurality("minute", minutesRest);

    return `${hours} ${hoursString} ${
      minutesRest === 0 ? "" : `and ${minutesRest} ${minutesString} `
    }ago`;
  }

  const days = Math.floor(minutes / (60 * 24));
  const daysString = days === 1 ? "day" : "days";
  return `${days} ${daysString} ago`;
}

function setPlurality(text, number) {
  return `${text}${number === 1 ? "" : "s"}`;
}
