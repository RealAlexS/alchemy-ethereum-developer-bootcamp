export const humanizeTsToDate = (timestamp) => {
  // Check if the timestamp is in seconds (typically 10 digits or less)
  // If so, convert to milliseconds. Otherwise, assume it's already in milliseconds...
  const timestampInMilliseconds =
    timestamp.toString().length <= 10 ? timestamp * 1000 : timestamp;

  const dateObj = new Date(timestampInMilliseconds);
  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return dateObj.toLocaleString("en-US", options);
};

export const humanizeTsToTimeDiff = (timestamp) => {
  const currentDate = new Date();

  // Check if the timestamp is in seconds (typically 10 digits or less)
  // If so, convert to milliseconds. Otherwise, assume it's already in milliseconds...
  const timestampInMilliseconds =
    timestamp.toString().length <= 10 ? timestamp * 1000 : timestamp;
  const inputDate = new Date(timestampInMilliseconds);
  const timeDifference = currentDate - inputDate;

  // Calculate the difference in various units
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  // Return the humanized time difference
  if (seconds < 60) {
    return `${seconds}s ago`;
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 30) {
    return `${days}d ago`;
  } else if (months < 12) {
    return `${months}mo ago`;
  } else {
    return `${years}y ago`;
  }
};
