import { StringCase } from './constants';

/**
 * Detect casing of a string value
 * @param input
 */
export const detectCase = (input: string): StringCase => {
  if (input.includes('_')) {
    if (/^([A-Z][A-Z0-9_]+)+$/.test(input)) return StringCase.ScreamingSnakeCase;
    if (/^([a-z][a-z0-9_]+)+$/.test(input)) return StringCase.SnakeCase;
  }

  if (/^([A-Z][a-z0-9_]*[A-Z]*){2,}$/.test(input)) return StringCase.PascalCase;
  if (/^([a-z][a-z0-9_]*[A-Z][a-z0-9_]*)+$/.test(input)) return StringCase.CamelCase;

  throw Error('Could not detect case');
};

/**
 * Capitalise an input (first character uppercase, rest lowercase)
 * @param input
 */
const capitalise = (input: string): string => {
  return `${input.charAt(0).toUpperCase()}${input.slice(1).toLowerCase()}`;
};

// De-constructors

/**
 * Split camel or pascal case into individual words
 * @param input
 */
export const deconstructCamelOrPascalCase = (input: string): string[] => {
  return input.split(
    /(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])|(?<=[a-zA-Z])(?=[0-9])|(?<=[0-9])(?=[a-zA-Z])/
  );
};

/**
 * Split snake or screaming snake into individual words
 * @param input
 */
export const deconstructSnakeOrScreamingSnakeCase = (input: string): string[] => {
  return input.split('_');
};

// Re-constructors

/**
 * Construct camel case string from an array of words
 * @param words
 */
export const constructCamelCase = (words: string[]): string => {
  return words
    .map((word, i) => {
      if (!i) return word.toLowerCase();
      return capitalise(word);
    })
    .join('');
};

/**
 * Construct pascal case string from an array of words
 * @param words
 */
export const constructPascalCase = (words: string[]): string => words.map(capitalise).join('');

/**
 * Construct snake case string from an array of words
 * @param words
 */
export const constructSnakeCase = (words: string[]): string => {
  return words.map((word) => word.toLowerCase()).join('_');
};

/**
 * Construct screaming snake case string from an array of words
 * @param words
 */
export const constructScreamingSnakeCase = (words: string[]): string => {
  return words.map((word) => word.toUpperCase()).join('_');
};

/**
 * Construct string from words
 * @param words
 * @param casing
 */
export const constructString = (words: string[], casing: StringCase): string => {
  switch (casing) {
    case StringCase.PascalCase:
      return constructPascalCase(words);
    case StringCase.CamelCase:
      return constructCamelCase(words);
    case StringCase.SnakeCase:
      return constructSnakeCase(words);
    case StringCase.ScreamingSnakeCase:
      return constructScreamingSnakeCase(words);
  }
};

// Transform String

/**
 * Transform string from any case to desired case
 * @param value
 * @param casing
 */
export const transformStringToCase = (value: string, casing: StringCase): string => {
  const originalCasing = detectCase(value);

  switch (originalCasing) {
    case StringCase.CamelCase:
    case StringCase.PascalCase:
      return constructString(deconstructCamelOrPascalCase(value), casing);
    case StringCase.SnakeCase:
    case StringCase.ScreamingSnakeCase:
      return constructString(deconstructSnakeOrScreamingSnakeCase(value), casing);
  }
};
