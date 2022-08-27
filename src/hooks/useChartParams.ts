import {
  useMemo,
  CSSProperties,
} from 'react';

import { DataItem } from 'types';

import {
  TDataItemRequired,
  TPieDonutChartPropsInternal,

} from 'types/PieDonutChart.types.internal';
import { sanitizeNumber } from 'utils/sanitizeNumber';
import { DEFAULT_CHART_TEXT_COLOR } from 'variables/defaults';


type TUseChartParams = {
  animationDuration: number;
  chartCenterSize: TPieDonutChartPropsInternal['chartCenterSize'];
  colorText: TPieDonutChartPropsInternal['colorText'];
  data: TDataItemRequired[];
  donutThickness: TPieDonutChartPropsInternal['donutThickness'];
  gap: TPieDonutChartPropsInternal['gap'];
  isSelectedValueShownInCenter: TPieDonutChartPropsInternal['isSelectedValueShownInCenter'];
  selected: TDataItemRequired | null;
  size: number;
  text: TPieDonutChartPropsInternal['text'];
};

/**
 * Describes return properties for the "useChartFontSize" hook
 * @typedef { Object } TUseChartFontSizeReturn

 * @property { number }             centerSize     - chart's center ("donut hole") size
 * @property { string | undefined } colorText      - text color
 * @property { number | undefined } donutThickness - thickness of segments for the "donut" type chart
 * @property { number }             radius         - chart radius
 * @property { CSSProperties }      segmentsStyles - style for chart segments
 * @property { string }             text           - chart text
 * @property { number }             totalDataValue - total data value
 * @property { string }             viewBox        - chart svg viewBox
 */
type TUseChartParamsReturn = {
  centerSize: number;
  colorText: string | undefined;
  donutThickness: number | undefined;
  radius: number;
  segmentsStyles: CSSProperties;
  text: string;
  totalDataValue: number;
  viewBox: string;
};

/**
 * Listens for some incoming params changes and calculates some of current chart params
 * @function useChartParams (hook)
 * @param { TUseChartParams } props
 * @return { TUseChartParamsReturn } returns chart params (centerSize, colorText, etc...)
 */
export const useChartParams = (props: TUseChartParams): TUseChartParamsReturn => {

  const {
    animationDuration,
    chartCenterSize,
    colorText: colorTextProp,
    data,
    donutThickness,
    gap,
    isSelectedValueShownInCenter,
    selected,
    size,
    text: textProp,
  } = props;

  /**
   * sum of data item's values
   */
  const totalDataValue = useMemo(() => data.reduce((current, next) => current + next.value, 0) || 0, [ data ]);

  /**
   * the item with the biggest value in data
   */
  const biggestValueItem: DataItem = useMemo(() => {
    let bvi = data[0];

    if (data.length > 1) {
      data.forEach(item => {
        if (item.value > bvi.value) {
          bvi = item;
        }
      });
    }

    return bvi;
  }, [ data ]) || 0;

  /**
   * chart viewBox
   */
  const viewBox = `0 0 ${size || 0} ${size || 0}`;

  /**
   * chart radius
   */
  const radius = useMemo(() => sanitizeNumber(size / 2), [ size ]);

  /**
   * chart center circle radius
   */
  const centerSize = useMemo(() => {
    if (typeof chartCenterSize !== 'undefined' && typeof chartCenterSize === 'number') {
      return chartCenterSize;
    }

    if (typeof donutThickness !== 'undefined' && donutThickness && typeof donutThickness === 'number') {
      return (radius - donutThickness) * 2;
    }

    return 0;
  }, [
    chartCenterSize,
    donutThickness,
    radius,
  ]);

  const segmentsStyles: CSSProperties = useMemo(() => ({
    transformOrigin: 'center',
    transition: 'ease-in-out',
    transitionDuration: `${animationDuration}ms`,
  }), [ animationDuration ]);

  const text = useMemo(() => {
    if (textProp) {
      return textProp;
    }

    if (centerSize || donutThickness) {
      if (isSelectedValueShownInCenter && selected) {
        return String(selected.value);
      }

      if (gap) {
        return String(totalDataValue - gap * data.length / 2);
      }

      return String(totalDataValue);
    }

    return '';
  }, [
    centerSize,
    data.length,
    donutThickness,
    gap,
    isSelectedValueShownInCenter,
    selected,
    textProp,
    totalDataValue,
  ]);

  /**
   * current text color
   */
  const colorText = useMemo(() => {
    if (colorTextProp) {
      return colorTextProp;
    }

    if (textProp) {
      return biggestValueItem.color;
    }

    if (selected) {
      return selected.color;
    }

    return DEFAULT_CHART_TEXT_COLOR;
  }, [
    biggestValueItem.color,
    colorTextProp,
    selected,
    textProp,
  ]);

  return {
    centerSize,
    colorText,
    donutThickness,
    radius,
    segmentsStyles,
    text,
    totalDataValue,
    viewBox,
  };
};
