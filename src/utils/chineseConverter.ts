import OpenCC from 'opencc-js';

// Initialize the converter from Traditional Chinese (Taiwan/Hong Kong) to Simplified Chinese (Mainland)
const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });

/**
 * Converts a Traditional Chinese string into Simplified Chinese.
 * If the input text is not a string, it returns it as-is.
 */
export function convertToSimplified(text: string): string {
  if (typeof text !== 'string' || !text) return text;
  return converter(text);
}
