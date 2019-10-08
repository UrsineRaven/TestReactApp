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

export const millisecondsInSecond = 1000;
export const secondsInMinute = 60;
export const minutesInHour = 60;
export const hoursInDay = 24;
export const daysInWeek = 7;
export const averageDaysInYear = 365.25;
export const monthsInYear = 12;
export const averageDaysInMonth = averageDaysInYear / monthsInYear;
export const weeksInYear = averageDaysInYear / daysInWeek;
export const averageWeeksInMonth = weeksInYear / monthsInYear;
export const millisecondsInMinute = millisecondsInSecond * secondsInMinute;
export const millisecondsInHour = millisecondsInMinute * minutesInHour;
export const millisecondsInDay = millisecondsInHour * hoursInDay;
export const averageMillisecondsInWeek = millisecondsInDay * daysInWeek;
export const averageMillisecondsInMonth =
  millisecondsInDay * averageDaysInMonth;
export const averageMillisecondsInYear = millisecondsInDay * averageDaysInYear;

/**
 * Return the number of milliseconds of the timezone offset for the provided date.
 * @param {Date} date - Date for which to get the offset.
 * @returns {number} Number of milliseconds of the timezone offset.
 */
export const getLocalTimezoneOffset = function(date) {
  return date.getTimezoneOffset() * 60000;
};

/**
 * Get the datetimes for the beginning of today (local time) and end of today (local time).
 * @returns {Array<number>} Array containing the datetimes (in milliseconds) of the beginning of today (index 0) and end of today (index 1) for the local timezone.
 */
export const getTodaysStartAndEndDatetimes = function() {
  const todaysDate = new Date(getLocalIsoString(new Date()).split('T')[0]); // Get beginning of today UTC
  const timezoneOffset = getLocalTimezoneOffset(todaysDate);
  const dayStart = todaysDate.getTime() + timezoneOffset;
  const dayEnd = dayStart + (millisecondsInDay - 1);
  return [dayStart, dayEnd];
};

/**
 * Get the datetimes for the beginning of startDate (local time) and end of endDate (local time).
 * @param {string} startDate - String containing start date formatted as yyyy-mm-dd
 * @param {string} endDate - String containing end date formatted as yyyy-mm-dd
 * @returns {Array<number>} Array containing the datetimes (in milliseconds) of the beginning of startDate (index 0) and end of endDate (index 1) for the local timezone.
 */
export const getStartAndEndDatetimes = function(startDate, endDate) {
  const timezoneOffset = getLocalTimezoneOffset(new Date());
  const startDatetime = startDate
    ? new Date(startDate).getTime() + timezoneOffset
    : null;
  const endDatetime = endDate
    ? new Date(endDate).getTime() + timezoneOffset + (millisecondsInDay - 1)
    : null;
  return [startDatetime, endDatetime];
};

/* Source: https://stackoverflow.com/a/6117889
 * ===========================================
 * For a given date, get the ISO week number
 *
 * Based on information at:
 *
 *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
 *
 * Algorithm is to find nearest thursday, it's year
 * is the year of the week number. Then get weeks
 * between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous
 * or next year, overlap is up to 3 days.
 *
 * e.g. 2014/12/29 is Monday in week  1 of 2015
 *      2012/1/1   is Sunday in week 52 of 2011
 */
/**
 * Get the ISO week number and year for a given date. A week is defined as starting on
 * Monday and belongs to whichever year the Thursday resides in.\
 * Source: https://stackoverflow.com/a/6117889
 * @param {Date} d - Date to get week number of.
 * @returns {Array<number>} Array with the week's year (index 0) and week number (index 1) of the provided date
 */
export const getIsoWeekNumber = function(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
};

/**
 * Get the week number and year for a given date. A week is defined as starting on
 * Sunday and belongs to whichever year the Wednesday resides in.\
 * Based on: https://stackoverflow.com/a/6117889
 * @param {string} dateString - String containing date for which to calculate the week number formatted as yyyy-mm-dd
 * @returns {Array<number>} Array with the week's year (index 0) and week number (index 1) of the provided date
 */
export const getWeekNumber = function(dateString) {
  let d = new Date(dateString);
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() + 1)); // +4 since we're targeting Wednesday, and +1 to make days 1-indexed
  const year = d.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const weekNo = Math.ceil((d - yearStart) / millisecondsInDay / 7);
  return [year, weekNo];
};

/**
 * Get the dates corresponding to the beginning and end of the week that the dateString belongs to.
 * @param {string} dateString - String containing date for which to get the dates of the beginning and end of its week. Formatted as yyy-mm-dd.
 * @returns {Array<Date>} Array containing the date for the beginning of the week (index 0) and the end of the week (index 1)
 */
export const getWeekStartAndEnd = function(dateString) {
  let start = new Date(dateString);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  start = new Date(start.getTime() + getLocalTimezoneOffset(start));
  let end = new Date(start.getTime());
  end.setUTCDate(end.getUTCDate() + 6);
  return [start, end];
};

/**
 * Calculate the amount of time that has passed since a specified date and return it in a human-readable format. It is possible to define a custom format. \
 * Note: It uses average lengths for everything (e.g. average number of days in a month)
 * @param {Date} datePast - The past date to calculate the time since
 * @param {string} [dateFormat="{year}y{day}d"] - The format to display time since in. Add tokens where you want different time periods to appear. \
 * Valid tokens are: {year}, {month}, {week}, {day}, {hour}, {minute}, {second}, and {millisecond} \
 * Defaults to: "{year}y{day}d"
 * @returns {string} The time since the specified date occured in a human-readable format defined by the dateFormat.
 */
export const getHumanReadableTimeSinceDatetime = function(
  datePast,
  dateFormat
) {
  let year, month, week, day, hour, minute, second, millisecond;
  const dateNow = new Date();
  const difference = dateNow.getTime() - datePast.getTime();
  let returnValue = dateFormat || '{year}y{day}d';
  const lowerFormat = returnValue.toLowerCase();

  const yearToken = /{year}/i;
  const monthToken = /{month}/i;
  const weekToken = /{week}/i;
  const dayToken = /{day}/i;
  const hourToken = /{hour}/i;
  const minuteToken = /{minute}/i;
  const secondToken = /{second}/i;
  const millisecondToken = /{millisecond}/i;

  let remainder = difference;
  if (lowerFormat.search(yearToken) !== -1) {
    const years = difference / averageMillisecondsInYear;
    year = Math.floor(years);
    returnValue = returnValue.replace(yearToken, year);
    remainder = remainder - year * averageMillisecondsInYear;
  }
  if (lowerFormat.search(monthToken) !== -1) {
    const months = remainder / averageMillisecondsInMonth;
    month = Math.floor(months);
    returnValue = returnValue.replace(monthToken, month);
    remainder = remainder - month * averageMillisecondsInMonth;
  }
  if (lowerFormat.search(weekToken) !== -1) {
    const weeks = remainder / averageMillisecondsInWeek;
    week = Math.floor(weeks);
    returnValue = returnValue.replace(weekToken, week);
    remainder = remainder - week * averageMillisecondsInWeek;
  }
  if (lowerFormat.search(dayToken) !== -1) {
    const days = remainder / millisecondsInDay;
    day = Math.floor(days);
    returnValue = returnValue.replace(dayToken, day);
    remainder = remainder - day * millisecondsInDay;
  }
  if (lowerFormat.search(hourToken) !== -1) {
    const hours = remainder / millisecondsInHour;
    hour = Math.floor(hours);
    returnValue = returnValue.replace(hourToken, hour);
    remainder = remainder - hour * millisecondsInHour;
  }
  if (lowerFormat.search(minuteToken) !== -1) {
    const minutes = remainder / millisecondsInMinute;
    minute = Math.floor(minutes);
    returnValue = returnValue.replace(minuteToken, minute);
    remainder = remainder - minute * millisecondsInMinute;
  }
  if (lowerFormat.search(secondToken) !== -1) {
    const seconds = remainder / millisecondsInSecond;
    second = Math.floor(seconds);
    returnValue = returnValue.replace(secondToken, second);
    remainder = remainder - second * millisecondsInSecond;
  }
  if (lowerFormat.search(millisecondToken) !== -1) {
    millisecond = remainder;
    returnValue = returnValue.replace(millisecondToken, millisecond);
  }

  return returnValue;
};
