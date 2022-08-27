import { TPieDonutChartPropsInternal } from 'types/PieDonutChart.types.internal';

export const DEFAULT_FONT_SIZE = 16;
export const FONT_SIZE_VALUE_CORRECTION_RATIO = 0.9;

export type TGetCurrentFontSizeProps = {
  centerSize?: number;
  donutThickness?: TPieDonutChartPropsInternal['donutThickness'];
  fontSize?: TPieDonutChartPropsInternal['fontSize'];
  size: TPieDonutChartPropsInternal['size'];
  text?: TPieDonutChartPropsInternal['text'];
};

/**
 * Calculates current chart font size
 * @function { (props: TGetCurrentFontSizeProps) => number } getCurrentFontSize
 * @param { TGetCurrentFontSizeProps } props
 * @return { number } returns chart font size
 */
export const getCurrentFontSize = (props: TGetCurrentFontSizeProps): number => {
  const {
    centerSize,
    donutThickness,
    fontSize: fontSizeProp,
    size: sizeProp,
    text,
  } = props;

  if (fontSizeProp) {
    return fontSizeProp;
  }

  if (text && sizeProp) {
    let size = centerSize || sizeProp;

    if (!centerSize && donutThickness) {
      size = size - donutThickness * 2;
    }

    return Math.floor(size / text.length * FONT_SIZE_VALUE_CORRECTION_RATIO);
  }

  return DEFAULT_FONT_SIZE;
};
