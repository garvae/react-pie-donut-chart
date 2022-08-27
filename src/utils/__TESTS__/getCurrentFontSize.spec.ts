import { TEST_PROPS } from 'tests/mocks/variables';
import {
  getCurrentFontSize,
  TGetCurrentFontSizeProps,
  DEFAULT_FONT_SIZE,
  FONT_SIZE_VALUE_CORRECTION_RATIO,
} from 'utils/getCurrentFontSize';


const TEST_GET_CURRENT_FONT_SIZE_PROPS_DEFAULT: Required<TGetCurrentFontSizeProps> = {
  centerSize: TEST_PROPS.chartCenterSize,
  donutThickness: TEST_PROPS.donutThickness,
  fontSize: TEST_PROPS.fontSize,
  size: TEST_PROPS.size,
  text: TEST_PROPS.text,
};

/**
 * Depends on "TEST_GET_CURRENT_FONT_SIZE_PROPS_DEFAULT"
 */
const TEST_CHART_SIZE_FONT_CALCULATED = 16;

describe('function "getCurrentFontSize"', () => {
  it('returns the provided "fontSize"', () => {
    expect.assertions(1);

    const fontSize = getCurrentFontSize(TEST_GET_CURRENT_FONT_SIZE_PROPS_DEFAULT);

    expect(fontSize).toBe(TEST_GET_CURRENT_FONT_SIZE_PROPS_DEFAULT.fontSize);
  });

  it('returns default "fontSize"', () => {
    expect.assertions(1);

    const fontSize = getCurrentFontSize({
      ...TEST_GET_CURRENT_FONT_SIZE_PROPS_DEFAULT,
      fontSize: undefined,
      text: undefined,
    });

    expect(fontSize).toBe(DEFAULT_FONT_SIZE);
  });

  it('returns the calculated "fontSize"', () => {
    expect.assertions(1);

    const fontSize = getCurrentFontSize({
      ...TEST_GET_CURRENT_FONT_SIZE_PROPS_DEFAULT,
      fontSize: undefined,
      text: undefined,
    });

    expect(fontSize).toBe(TEST_CHART_SIZE_FONT_CALCULATED);
  });

  it('returns the calculated "fontSize" when no "centerSize" is provided but "donutThickness" is provided', () => {
    expect.assertions(1);

    const fontSize = getCurrentFontSize({
      ...TEST_GET_CURRENT_FONT_SIZE_PROPS_DEFAULT,
      centerSize: undefined,
      fontSize: undefined,
    });

    const donutThickness = TEST_GET_CURRENT_FONT_SIZE_PROPS_DEFAULT.donutThickness as number;
    const size = TEST_GET_CURRENT_FONT_SIZE_PROPS_DEFAULT.size as number;
    const text = TEST_GET_CURRENT_FONT_SIZE_PROPS_DEFAULT.text as string;

    const expectedSize = Math.floor((size - donutThickness * 2) / text.length * FONT_SIZE_VALUE_CORRECTION_RATIO);

    expect(fontSize).toBe(expectedSize);
  });
});
