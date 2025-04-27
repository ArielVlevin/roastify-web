export const convertMinutesToSeconds = (minutes: number) =>
  Math.round(minutes * 60);

export const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes} min ${seconds} sec`;
};

export const fahrenheitToCelsius = (fahrenheit: number): number =>
  Math.round((((fahrenheit - 32) * 5) / 9) * 10) / 10;

export const getTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
