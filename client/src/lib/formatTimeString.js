export default function formatTimeString(time) {
    if (time < 1) {
        return "less than a minute ago";
    }

    if (time < 60) {
        const minutesString = time === 1 ? "minute" : "minutes";
        return `${time} ${minutesString} ago`;
    }
    if (time >= 60 && time < 1440) {
        const hours = Math.floor(time / 60);
        const hoursString = hours === 1 ? "hour" : "hours";
        const minutes = time % 60;
        const minutesString = minutes === 1 ? "minute" : "minutes";

        return `${hours} ${hoursString} ${
            minutes === 0 ? "" : `and ${minutes} ${minutesString} `
        }ago`;
    }

    const days = Math.floor(time / (60 * 60 * 24));
    const daysString = days === 1 ? "day" : "days";
    return `${days} ${daysString} ago`;
}
