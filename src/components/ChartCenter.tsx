import React from 'react';

import { TUseChartPropsReturn } from 'hooks/useChartProps';

export const TEST_DATA_ID_CHART_CENTER = 'TEST_DATA_ID_CHART_CENTER';

type TChartCenter = Pick<TUseChartPropsReturn,
'centerSize'
| 'classNameChartCenter'
| 'colorChartCenter'
| 'radius'
>;

/**
 * Chart's center ("donut hole")
 * @component ChartCenter
 * @param { TChartCenter } props
 * @returns { JSX.Element } returns svg circle <circle>
 */
export const ChartCenter: React.FC<TChartCenter> = props => {

  const {
    centerSize,
    classNameChartCenter,
    colorChartCenter,
    radius,
  } = props;

  if (!centerSize) {
    return null;
  }

  return (
    <circle
      className={classNameChartCenter}
      cx={radius}
      cy={radius}
      data-testid={TEST_DATA_ID_CHART_CENTER}
      fill={colorChartCenter}
      r={centerSize / 2}
      style={{ pointerEvents: 'none' }}
    />
  );
};
