import React from 'react';

import { TUseChartPropsReturn } from 'hooks/useChartProps';

export const TEST_DATA_ID_CHART_SEGMENTS_BACKGROUND = 'TEST_DATA_ID_CHART_SEGMENTS_BACKGROUND';

type TChartSegmentsBackground = Pick<TUseChartPropsReturn,
'classNameChartSegmentsBackground'
| 'classNameSvgGroupSegmentsBackground'
| 'colorSegmentsBackground'
| 'donutThickness'
| 'radius'
>;

/**
 * Chart segments background. Same shape as chart's segments but without gap.
 * @component ChartSegmentsBackground
 * @param { TChartSegmentsBackground } props
 * @returns { JSX.Element } returns svg group <g> of <path>
 */
export const ChartSegmentsBackground: React.FC<TChartSegmentsBackground> = props => {

  const {
    classNameChartSegmentsBackground,
    classNameSvgGroupSegmentsBackground,
    colorSegmentsBackground,
    donutThickness,
    radius,
  } = props;

  if (!colorSegmentsBackground) {
    return null;
  }

  return (
    <g className={classNameSvgGroupSegmentsBackground}>
      <circle
        className={classNameChartSegmentsBackground}
        cx={radius}
        cy={radius}
        data-testid={TEST_DATA_ID_CHART_SEGMENTS_BACKGROUND}
        fill="none"
        r={donutThickness ? radius - donutThickness / 2 : 0}
        stroke={colorSegmentsBackground}
        strokeWidth={donutThickness}
        style={{ pointerEvents: 'none' }}
      />
    </g>
  );
};
