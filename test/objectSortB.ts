// The following line prevents this file from being included in test coverage reports.
/* istanbul ignore file */

/**
 * This example will place specific keys in a specified order.
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
  const presort = ['f', 'o', 'u', 'b', 'a', 'r'];

  if (!presort.includes(a) && !presort.includes(b)) {
    // Sort normally if not in presort.
    return a.localeCompare(b);
  } else if (presort.includes(a) && !presort.includes(b)) {
    // Presort elements come first.
    return -1000;
  } else if (!presort.includes(a) && presort.includes(b)) {
    // Presort elements come first.
    return 1000;
  }
  // If a has a lower index, the result is negative, and a comes first.
  return presort.indexOf(a) - presort.indexOf(b);
};

export default sort;
