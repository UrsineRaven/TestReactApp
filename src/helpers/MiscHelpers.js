/**
 * Returns whether the specified object is empty or not. (ECMA 7+)   \
 * Source: https://stackoverflow.com/a/32108184
 * @param {Object} obj - the object to check.
 * @returns {boolean} Returns true if the object is empty, false otherwise.
 */
export const isObjectEmpty = function(obj) {
  // ECMA 7+:
  // because Object.entries(new Date()).length === 0;
  // we have to do some additional check
  return Object.entries(obj).length === 0 && obj.constructor === Object;
};
