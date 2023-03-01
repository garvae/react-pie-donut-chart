import {
  DataItem,
  PieDonutChartPropRef,
  PieDonutChartProps,
  PieDonutChartPropsClassNames,
  PieDonutChartPropsColors,
  PieDonutChartPropSize,
} from 'types';

import { containerRefMocked } from 'tests/mocks/container-ref';
import { AllRequired } from 'types/utils';
import { TCreateChartSegmentPathDraw } from 'utils/createChartSegmentPathDraw/createChartSegmentPathDraw.types';


export const TEST_DATA: AllRequired<DataItem>[] = [
  {
    color: '#287BC8',
    id: '001',
    order: 1,
    value: 10,
  },
  {
    color: '#D64045',
    id: '002',
    order: 2,
    value: 40,
  },
  {
    color: '#daf6ec',
    id: '003',
    order: 3,
    value: 30,
  },
  {
    color: '#2B2D42',
    id: '005',
    order: 5,
    value: 50,
  },
  {
    color: '#9ED8DB',
    id: '004',
    order: 4,
    value: 20,
  },
];

export const TEST_SIZE_CHART = 300;
export const TEST_SIZE_CHART_HALF = TEST_SIZE_CHART / 2;
export const TEST_SIZE_CHART_HALF_STR = String(TEST_SIZE_CHART_HALF);
export const TEST_COLOR = '#ffffff';
export const TEST_REF_CONTAINER = containerRefMocked(TEST_SIZE_CHART);

export const TEST_CLASSNAMES: AllRequired<PieDonutChartPropsClassNames> = {
  chartBackground: 'test-classname-classNameChartBackground',
  chartCenter: 'test-classname-classNameChartCenter',
  chartSegment: 'test-classname-classNameChartSegment',
  chartSegmentsBackground: 'test-classname-classNameChartSegmentsBackground',
  children: 'test-classname-classNameChildren',
  svgGroupSegments: 'test-classname-classNameSvgGroupSegments',
  svgGroupSegmentsBackground: 'test-classname-classNameSvgGroupSegmentsBackground',
  svgGroupText: 'test-classname-classNameSvgGroupText',
  svgObjectText: 'test-classname-classNameSvgObjectText',
  text: 'test-classname-classNameText',
};

export const TEST_COLORS: AllRequired<PieDonutChartPropsColors> = {
  chartBackground: TEST_COLOR,
  chartCenter: TEST_COLOR,
  segmentFocusedOutline: TEST_COLOR,
  segmentsBackground: TEST_COLOR,
  text: TEST_COLOR,
};

export type TPieDonutChartPropsUserAll = Omit<PieDonutChartProps, 'size' | 'parentRef'> & {
  parentRef: PieDonutChartPropRef;
  size: PieDonutChartPropSize;
};

export const TEST_PROPS: AllRequired<Omit<TPieDonutChartPropsUserAll, 'children' | 'parentRef' | 'stylesHoveredSegment'>> & {
  children: TPieDonutChartPropsUserAll['children'],
  parentRef: TPieDonutChartPropsUserAll['parentRef'],
  stylesHoveredSegment: TPieDonutChartPropsUserAll['stylesHoveredSegment'],
} = {
  animationSpeed: 123,
  chartCenterSize: 100,
  children: null,
  className: 'test-classname-className',
  classNames: TEST_CLASSNAMES,
  colors: TEST_COLORS,
  data: TEST_DATA,
  donutThickness: 10,
  fontSize: 24,
  gap: 8,
  hoverScaleRatio: 1.75,
  isScaleOnHover: false,
  isSelectOnClick: false,
  isSelectOnKeyEnterDown: false,
  isSelectedValueShownInCenter: false,
  maxSize: TEST_SIZE_CHART / 3,
  minSize: TEST_SIZE_CHART * 1.25,
  onSegmentClick: () => undefined,
  onSegmentKeyEnterDown: () => undefined,
  parentRef: TEST_REF_CONTAINER,
  resizeReRenderDebounceTime: 15,
  selected: TEST_DATA[0].id,
  size: TEST_SIZE_CHART,
  stylesHoveredSegment: { color: TEST_COLOR },
  tabIndex: 0,
  text: 'Test text',
  widthSegmentFocusedOutline: 3,
};

export const TEST_CHART_PROPS_COMMON: PieDonutChartProps = {
  data: TEST_PROPS.data,
  size: TEST_PROPS.size,
};

export const FAKE_DATA_SLICED = TEST_PROPS.data.slice(0, 2);
export const FAKE_DATA_SINGLE_SEGMENT = [ TEST_PROPS.data[0] ];
export const FAKE_DATA_ONLY_ONE_VALID_SEGMENT = TEST_CHART_PROPS_COMMON.data.map((item, i) => {
  if (i === 0) {
    return {
      ...item,
      value: 10,
    };
  }

  return {
    ...item,
    value: 0,
  };
});

export const CHECK_INCOMING_VALUES_TEST_VALUES_VALID: TCreateChartSegmentPathDraw = {
  radiusInner: TEST_SIZE_CHART / 3,
  radiusOuter: TEST_SIZE_CHART_HALF,
  size: TEST_SIZE_CHART,
  valueSegment: 1,
  valueSegmentsPreviousTotal: 0,
  valueSegmentsTotal: 3,
};

export const CHECK_INCOMING_VALUES_TEST_VALUES_INVALID: TCreateChartSegmentPathDraw = {
  ...CHECK_INCOMING_VALUES_TEST_VALUES_VALID,
  size: TEST_SIZE_CHART / 5,
};

/**
 * Depends on "CHECK_INCOMING_VALUES_TEST_VALUES_VALID"
 */
export const TEST_CHART_SEGMENT_PATH_DRAW = 'M 300 150 A 150 150 0 0 0 75.00000000000003 20.0961894323342 L 100.00000000000003 63.39745962155612 A 100 100 0 0 1 250 150 L 300 150';
