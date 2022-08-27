import React from 'react';

import { TUseChartPropsReturn } from 'hooks/useChartProps';

export const TEST_DATA_ID_CHART_BACKGROUND = 'TEST_DATA_ID_CHART_BACKGROUND';

type TChartBackground = Pick<TUseChartPropsReturn,
'classNameChartBackground'
| 'colorChartBackground'
| 'radius'
>;

/**
 * Chart's background
 * @component ChartBackground
 * @param { TChartBackground } props
 * @returns { JSX.Element } returns svg circle <circle>
 */
export const ChartBackground: React.FC<TChartBackground> = props => {

  const {
    classNameChartBackground,
    colorChartBackground,
    radius,
  } = props;

  if (!colorChartBackground) {
    return null;
  }

  return (
    <circle
      className={classNameChartBackground}
      cx={radius}
      cy={radius}
      data-testid={TEST_DATA_ID_CHART_BACKGROUND}
      fill={colorChartBackground}
      r={radius}
      style={{ pointerEvents: 'none' }}
    />
  );
};
