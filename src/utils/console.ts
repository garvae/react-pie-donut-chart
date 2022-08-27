import { isProduction } from 'utils/env';

const alignConsoleTextLeftDefaultErr = `
Something went wrong while working with strings...
And seems like it's an INTERNAL LIBRARY error.

Error in: "lowerCaseFirstLetter" function
`;

export const alignConsoleTextLeft = (text: string) => {

  if (!text || typeof text !== 'string') {
    if (!isProduction()) {
      // eslint-disable-next-line no-console
      console.error([ alignConsoleTextLeftDefaultErr, `Received text: ${text}` ].join('\n\n'));
    }

    return '';
  }

  return text.replaceAll('  ', '');
};

const defaultReportLinkMessage = `
If you see this error and are sure that all properties passed to the "PieDonutChart" component are valid, 
please open an issue here: https://github.com/garvae/react-pie-donut-chart.
`;

type TCreateErrorWithDescriptionProps = {
  messageMain: string;
  report?: string;
};

export const createErrorWithDescription = (props: TCreateErrorWithDescriptionProps) => {

  const {
    messageMain,
    report: reportProp,
  } = props;

  const title = '😢 😢 😢 Sorry, but something went wrong while calculating the chart params.';

  const hint = `
Please check:
1. All necessary and valid properties are passed to the "PieDonutChart" component
2. No other errors are displayed in the console

${defaultReportLinkMessage}
`;

  const report: string[] = [ title ];

  if (messageMain && typeof messageMain === 'string') {
    report.push(messageMain);
  }

  report.push(hint);

  if (reportProp && typeof reportProp === 'string') {
    report.push(`
* * * * * * *
If want to open an issue please include the information below in the bug report.

${reportProp}
* * * * * * *
`);
  }

  return report.join('\n\n');
};

const defaultConsolePs = `
- - - - - - - - - - -
P.S. This message will not be shown in the 'production' mode.
`;

/**
 * Manages errors showing in "development" and "production" mods
 * @function { (err: string) => void } consoleError
 * @param { string } err - error to show in console
 */
export const consoleError = (err: string) => {
  if (!isProduction()) {
    // eslint-disable-next-line no-console
    console.error(alignConsoleTextLeft(`
    ${err}
    
    ${defaultConsolePs}
    `));
  }
};

/**
 * Manages warnings showing in "development" and "production" mods
 * @function { (warn: string) => void } consoleWarn
 * @param { string } warn - warning to show in console
 */
export const consoleWarn = (warn: string) => {
  if (!isProduction()) {
    // eslint-disable-next-line no-console
    console.warn(alignConsoleTextLeft(`
    ${warn}
    
    ${defaultConsolePs}
    `));
  }
};
