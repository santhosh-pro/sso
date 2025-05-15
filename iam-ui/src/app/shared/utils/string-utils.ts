export function arrayToCSV(arr: (string | null | undefined)[]): string {
  const filteredArr = arr.filter((item) => item !== null && item !== undefined && item !== '');
  return filteredArr.join(', ');
}

export function arrayToSpaceSeparator(arr: (string | null | undefined)[]): string {
  const filteredArr = arr.filter((item) => item !== null && item !== undefined && item !== '');
  return filteredArr.join(' ');
}

export function arrayToSeparator(arr: (string | null | undefined)[], separator: string = ','): string {
  const filteredArr = arr.filter((item) => item !== null && item !== undefined && item !== '');
  return filteredArr.join(`${separator}`);
}

export function toSentenceCase(value: string): string {
  return value
    .replace(/([A-Z])/g, ' $1') // Insert spaces before capital letters
    .trim() // Remove leading spaces
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
}

