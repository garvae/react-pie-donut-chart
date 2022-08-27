import {
  consoleError,
  createErrorWithDescription,
} from 'utils/console';

export const DEFAULT_SANITISE_NUMBER_VALUE = 0;

/**
 * Sanitizes number
 * @function { (e: React.KeyboardEvent) => boolean } isKeyDownEnter
 * @param { number } n                 - number to sanitize
 * @param { number = 0 } defaultNumber - default number
 * @return { number } - sanitized number
 */
export const sanitizeNumber = (n: number, defaultNumber = DEFAULT_SANITISE_NUMBER_VALUE) => {
  if (isNaN(n)) {
    consoleError(createErrorWithDescription({
      messageMain: 'In most cases, this error is caused by invalid props.',
      report: `
      Error in: "sanitizeNumber" function
      Received value: ${n}
      `,
    }));
    return defaultNumber;
  }

  return n;
};
