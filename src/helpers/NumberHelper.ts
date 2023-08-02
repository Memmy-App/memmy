/* eslint-disable no-plusplus */

// https://stackoverflow.com/questions/2685911/is-there-a-way-to-round-numbers-into-a-reader-friendly-format-e-g-1-1k

export function shortenNumber(number: number, decPlaces = 1) {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = 10 ** decPlaces;

  let newNumber = String(number);

  // Enumerate number abbreviations
  const abbrev = ["k", "m", "b", "t"];

  // Go through the array backwards, so we do the largest first
  for (let i = abbrev.length - 1; i >= 0; i--) {
    // Convert array index to "1000", "1000000", etc
    const size = 10 ** ((i + 1) * 3);

    // If the number is bigger or equal do the abbreviation
    if (size <= number) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      number = Math.round((number * decPlaces) / size) / decPlaces;

      // Handle special case where we round up to the next abbreviation
      if (number === 1000 && i < abbrev.length - 1) {
        number = 1;
        i++;
      }

      // Add the letter for the abbreviation
      newNumber = String(number) + abbrev[i];

      // We are done... stop
      break;
    }
  }

  return newNumber;
}
