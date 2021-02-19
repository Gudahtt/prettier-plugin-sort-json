// The following line prevents this file from being included in test coverage reports.
/* istanbul ignore file */

/**
 * This example will place numbers first,
 * then the string 'k', then sort the others in reverse chronological order.
 * Known caveat: Due to a language quirk, the JSON will always display
 * numeric values in ascending order before
 * @see: https://www.stefanjudis.com/today-i-learned/property-order-is-predictable-in-javascript-objects-since-es2015/
 */

/**
 * @param {string} a The first element to sort, converted to a string.
 * @param {string} b The second element to sort, converted to a string.
 *
 * @returns {number} A number:
 * < 0 - First element must be placed before second
 *   0 - Both elements is equal, do not change order.
 * > 0 - Second element must be placed before first.
 */
const sort = (a: string, b: string): number => {
  if (a === b) {
    return 0;
  }
  if (a === 'k') {
    return -1000;
  }
  if (b === 'k') {
    return 1000;
  }

  return b.localeCompare(a);
};

export default sort;
