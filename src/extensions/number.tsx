// utils.ts

// Utility function to parse a string as a float and return 0 if it can't be parsed
export const toSafeFloat = (input: string | number | null | undefined): number => {
  if (input === null || input === undefined) {
    return 0;
  }
  const parsedNumber = parseFloat(String(input));
  if (isNaN(parsedNumber)) {
    return 0;
  }
  return parsedNumber;
};
