import React from 'react';

import { Chart } from 'components/Chart';
import { ChartBackground } from 'components/ChartBackground';
import { ChartCenter } from 'components/ChartCenter';
import { ChartSegmentsBackground } from 'components/ChartSegmentsBackground';
import { ChartText } from 'components/ChartText';
import { useChartProps } from 'hooks/useChartProps';
import PieDonutChartType, { PieDonutChartProps } from 'types/index';
import {
  TPieDonutChartCommonPropsColors,
  TPieDonutChartCommonPropsClassNames,
} from 'types/PieDonutChart.types.internal';


export const TEST_DATA_ID_CHART_SVG_MAIN = 'TEST_DATA_ID_CHART_SVG_MAIN';

export const PieDonutChart: typeof PieDonutChartType = (props: PieDonutChartProps): JSX.Element => {

  const {
    classNames: classNamesProp,
    colors: colorsProp,
    ...rest
  } = props;

  const classNames: TPieDonutChartCommonPropsClassNames = {
    classNameChartBackground: classNamesProp?.chartBackground,
    classNameChartCenter: classNamesProp?.chartCenter,
    classNameChartSegment: classNamesProp?.chartSegment,
    classNameChartSegmentsBackground: classNamesProp?.chartSegmentsBackground,
    classNameChildren: classNamesProp?.children,
    classNameSvgGroupSegments: classNamesProp?.svgGroupSegments,
    classNameSvgGroupSegmentsBackground: classNamesProp?.svgGroupSegmentsBackground,
    classNameSvgGroupText: classNamesProp?.svgGroupText,
    classNameSvgObjectText: classNamesProp?.svgObjectText,
    classNameText: classNamesProp?.text,
  };

  const colors: TPieDonutChartCommonPropsColors = {
    colorChartBackground: colorsProp?.chartBackground,
    colorChartCenter: colorsProp?.chartCenter,
    colorSegmentFocusedOutline: colorsProp?.segmentFocusedOutline,
    colorSegmentsBackground: colorsProp?.segmentsBackground,
    colorText: colorsProp?.text,
  };

  const properties = useChartProps({ props: {
    ...classNames,
    ...colors,
    ...rest,
  } });

  return (
    <svg
      className={properties.className}
      data-testid={TEST_DATA_ID_CHART_SVG_MAIN}
      style={
        {
          alignItems: 'center',
          aspectRatio: '1 / 1',
          display: 'flex',
          height: `${properties.size || properties.minSize || 0}px`,
          justifyContent: 'center',
          overflow: 'visible',
          transformOrigin: 'center',
          width: `${properties.size || properties.minSize || 0}px`,
        }
      }
      viewBox={properties.viewBox}
    >
      <ChartBackground {...properties} />

      <ChartSegmentsBackground {...properties} />

      <Chart {...properties} />

      <ChartCenter {...properties} />

      <ChartText {...properties}>
        {properties.children}
      </ChartText>
    </svg>
  );
};
