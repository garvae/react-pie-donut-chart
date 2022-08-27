import {
  consoleError,
  createErrorWithDescription,
} from 'utils/console';

const ChanelRand = (): number => Math.floor(Math.random() * (256 + 1));

type TRGBRandReturn = [number, number, number];

const rgbRand = (): TRGBRandReturn => [
  ChanelRand(),
  ChanelRand(),
  ChanelRand(),
];
const rgbToHex = (rgb: TRGBRandReturn) => ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
const colorRand = () => rgbToHex(rgbRand());

/**
 * Generates random HEX color string
 * @function { () => string } randomColorHEX
 * @return { string } returns random HEX color string
 */
export const randomColorHEX = () => '#' + colorRand();

/**
 * RGB color regexp
 */
export const RGB_REG_EXP = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;

/**
 * HEX color regexp
 */
export const HEX_REG_EXP = /^#?(([\da-f]){3}|([\da-f]){6})$/i;

/**
 * Converts both 3-digit and 6-digit HEX color to RGB string
 * Provided "color" must be 6-digit or 6-digit without "#" symbol or 4-digit 7-digit with "#" symbol
 *
 * @function { color: string => string } convertHexToRgb
 * @return { string } returns RGB color string or empty string
 */
export const convertHexToRgb = (color: string): string => {
  const errMessage = createErrorWithDescription({
    messageMain: `
    Something went wrong while working with colors...
    
    Make sure the colors provided to the "PieDonutChart" meet the following requirements:
    
    Color must be only HEX string and must be 
    7-characters starts with "#" symbol ('#ffffff')
    or 6-characters without "#" symbol ('ffffff')
    or 4-characters starts with "#" symbol ('#fff')
    or 3-characters without "#" symbol ('fff')
    `,
    report: `
    Error in: "convertHexToRgb" function
    Received value: ${color}
    `,
  });

  if (
    !color
    || typeof color !== 'string'
    || color.length < 3
    || color.length > 7
  ) {
    consoleError(errMessage);
    return '';
  }

  const replacer = (...args: string[]) => {
    const [
      _,
      r,
      g,
      b,
    ] = args;

    return '' + r + r + g + g + b + b;
  };

  const rgbHexArr = color
    ?.replace(HEX_REG_EXP, replacer)
    .match(/.{2}/g)
    ?.map(x => parseInt(x, 16));

  /**
   * "HEX_REG_EXP.test" is here to create more strong tests
   */
  if (rgbHexArr && Array.isArray(rgbHexArr) && HEX_REG_EXP.test(color)) {
    return `rgb(${rgbHexArr[0]}, ${rgbHexArr[1]}, ${rgbHexArr[2]})`;
  }

  consoleError(errMessage);
  return '';
};
