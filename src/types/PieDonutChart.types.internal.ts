import {
  DataItem,
  PieDonutChartProps,
} from './index';

export type TPieDonutChartCommonPropsClassNames = {
  classNameChartBackground?: string;
  classNameChartCenter?: string;
  classNameChartSegment?: string;
  classNameChartSegmentsBackground?: string;
  classNameChildren?: string;
  classNameSvgGroupSegments?: string;
  classNameSvgGroupSegmentsBackground?: string;
  classNameSvgGroupText?: string;
  classNameSvgObjectText?: string;
  classNameText?: string;
};

export type TPieDonutChartCommonPropsColors = {
  colorChartBackground?: string;
  colorChartCenter?: string;
  colorSegmentFocusedOutline?: string;
  colorSegmentsBackground?: string;
  colorText?: string;
};

export type TPieDonutChartPropsInternal = Omit<PieDonutChartProps, 'classNames' | 'colors'> & TPieDonutChartCommonPropsClassNames & TPieDonutChartCommonPropsColors;

export type TDataItemRequired = Required<DataItem>;


