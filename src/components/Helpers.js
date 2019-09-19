/**
 * Returns the ISO-formatted string for the local timezone of the specified Date object.
 * @param {Date} date - Date object for which to return the local ISO string.
 * @returns {string} The ISO-formatted string corresponding to the local time of the specified Date.
 */
export const getLocalIsoString = function(date) {
  return new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();
};

/**
 * Returns an array containing the local ISO-formatted date and time.
 * @param {Date} date - Date object for which to generate the local ISO strings.
 * @returns {Array<string>} Array containing the local ISO-formatted date (index 0) and time (index 1).
 */
export const getLocalIsoDateAndTime = function(date) {
  const isoString = getLocalIsoString(date);
  return splitIsoString(isoString);
};

/**
 * Returns an array containing the date and time.
 * @param {string} isoString - ISO string to split.
 * @returns {Array<string>} Array containing the ISO-formatted date (index 0) and time (index 1).
 */
export const splitIsoString = function(isoString) {
  const dateSplit = isoString.split('T');
  const timeSplit = dateSplit[1].split('.');
  return [dateSplit[0], timeSplit[0]];
};

/** One less than the number of milliseconds in a day */
export const millisecondsInDay = 86399999;

/**
 * Return the number of milliseconds of the timezone offset for the provided date.
 * @param {Date} date - Date for which to get the offset.
 * @returns {number} Number of milliseconds of the timezone offset.
 */
export const getLocalTimezoneOffset = function(date) {
  return date.getTimezoneOffset() * 60000;
};
