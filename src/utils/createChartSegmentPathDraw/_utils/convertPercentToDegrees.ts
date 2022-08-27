
/**
 * Describes properties for the convertPercentToDegrees function
 * @typedef { Object } TConvertPercentToDegrees
 * @property { number } percent - angle in percents
 */
type TConvertPercentToDegrees = {
  percent: number;
};

/**
 * Converts segment percentage to angle degrees
 * @function convertPercentToDegrees
 * @param { TConvertPercentToDegrees } props
 * @returns { number } angle degrees
 */
export const convertPercentToDegrees = (props: TConvertPercentToDegrees) => {

  const { percent } = props;

  if (typeof percent !== 'number') {
    return 0;
  }

  return percent / 100 * 360;
};
