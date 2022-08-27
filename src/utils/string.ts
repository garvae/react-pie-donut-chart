import {
  createErrorWithDescription,
  consoleError, 
} from 'utils/console';

export const lowerCaseFirstLetter = (str: string) => {
  if (!str || typeof str !== 'string') {
    consoleError(createErrorWithDescription({
      messageMain: `
    Something went wrong while working with strings...
    And seems like it's an INTERNAL LIBRARY error.
    `,
      report: `
    Error in: "lowerCaseFirstLetter" function
    Received str: ${str}
    `,
    }));

    return '';
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};
