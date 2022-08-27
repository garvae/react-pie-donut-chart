import React, {
  RefObject,
  PropsWithChildren,
} from 'react';


import {
  render,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  TChartProps,
  Chart,
  TEST_DATA_ID_CHART_GROUP_SEGMENTS,
  TEST_DATA_ID_CHART_GROUP_SEGMENT,
  TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP,
} from 'components/Chart';
import { TEST_DATA_ID_CHART_SVG_MAIN } from 'components/PieDonutChart';
import { TEST_PROPS } from 'tests/mocks/variables';

import { DataItem } from '../../types';


const SVGWrapper = (props: PropsWithChildren) => {

  const { children } = props;

  return (
    <svg
      data-testid={TEST_DATA_ID_CHART_SVG_MAIN}
      style={
        {
          alignItems: 'center',
          aspectRatio: '1 / 1',
          display: 'flex',
          height: `${TEST_PROPS.size}px`,
          justifyContent: 'center',
          overflow: 'visible',
          transformOrigin: 'center',
          width: `${TEST_PROPS.size}px`,
        }
      }
      viewBox={`0 0 ${TEST_PROPS.size} ${TEST_PROPS.size}`}
    >
      {children}
    </svg>
  );
};

const stubDefault = () => undefined;

const CHART_TEST_PROPS: TChartProps = {
  chartRef: TEST_PROPS.parentRef as unknown as RefObject<SVGSVGElement>,
  classNameChartSegment: TEST_PROPS.classNames.chartSegment,
  classNameSvgGroupSegments: TEST_PROPS.classNames.svgGroupSegments,
  colorSegmentFocusedOutline: TEST_PROPS.colors.segmentFocusedOutline,
  data: TEST_PROPS.data as Required<DataItem>[],
  donutThickness: TEST_PROPS.donutThickness,
  focusedSegment: null,
  gap: TEST_PROPS.gap,
  handleClearSelects: stubDefault,
  hoverScaleRatio: TEST_PROPS.hoverScaleRatio,
  hoveredSegment: null,
  isScaleOnHover: TEST_PROPS.isScaleOnHover,
  isSelectOnClick: TEST_PROPS.isSelectOnClick,
  isSelectOnKeyEnterDown: TEST_PROPS.isSelectOnKeyEnterDown,
  mouseDownSegment: null,
  onSegmentClick: TEST_PROPS.onSegmentClick as TChartProps['onSegmentClick'],
  onSegmentKeyEnterDown: TEST_PROPS.onSegmentKeyEnterDown as TChartProps['onSegmentKeyEnterDown'],
  radius: TEST_PROPS.size / 2,
  segmentsStyles: {},
  selected: undefined,
  setFocusedSegment: stubDefault,
  setHoveredSegment: stubDefault,
  setMouseDownSegment: stubDefault,
  setSelected: stubDefault,
  size: TEST_PROPS.size,
  strokeWidth: TEST_PROPS.widthSegmentFocusedOutline,
  stylesHoveredSegment: TEST_PROPS.stylesHoveredSegment,
  tabIndex: TEST_PROPS.tabIndex,
  totalDataValue: TEST_PROPS.data.reduce((current, next) => current + next.value, 0),
};

describe('main "Chart" component', () => {
  it('"onMouseLeave" resets "hoveredSegment" state', () => {
    expect.assertions(4);

    const stub = jest.fn();

    const {
      getAllByTestId,
      getByTestId,
      rerender,
    } = render((
      <SVGWrapper>
        <Chart
          {...CHART_TEST_PROPS}
          setHoveredSegment={stub}
        />
      </SVGWrapper>
    ));

    const chart = getByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENTS);
    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    fireEvent.mouseOver(segment, { bubbles: true });


    const expectedHoveredSegment = CHART_TEST_PROPS.data[0].id;
    expect(stub).toHaveBeenCalledTimes(1);
    expect(stub).toHaveBeenCalledWith(expectedHoveredSegment);

    rerender((
      <SVGWrapper>
        <Chart
          {...CHART_TEST_PROPS}
          hoveredSegment={expectedHoveredSegment}
          setHoveredSegment={stub}
        />
      </SVGWrapper>
    ));

    fireEvent.mouseLeave(chart, { bubbles: true });

    expect(stub).toHaveBeenCalledWith(null);
    expect(stub).toHaveBeenCalledTimes(2);
  });

  it('renders the chart when the specified "data" length is 1', () => {
    expect.assertions(1);

    const data = [ CHART_TEST_PROPS.data[0] ];

    const { getAllByTestId } = render((
      <SVGWrapper>
        <Chart
          {...CHART_TEST_PROPS}
          data={data}
        />
      </SVGWrapper>
    ));

    const segments = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT);

    expect(segments).toHaveLength(data.length);
  });

  it('"onKeyDownCapture" handler sets "selected" state', () => {
    expect.assertions(1);

    const stub = jest.fn();

    const { getAllByTestId } = render((
      <SVGWrapper>
        <Chart
          {...CHART_TEST_PROPS}
          isSelectOnKeyEnterDown
          onSegmentKeyEnterDown={undefined}
          setSelected={stub}
        />
      </SVGWrapper>
    ));

    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    fireEvent.keyDown(segment, {
      code: 13,
      key: 'Enter',
    });

    expect(stub).toHaveBeenCalledWith(CHART_TEST_PROPS.data[0].id);
  });

  it('"onClick" handler fires no events on "gap" segment', () => {
    expect.assertions(2);

    const stub = jest.fn();

    const { getAllByTestId } = render((
      <SVGWrapper>
        <Chart
          {...CHART_TEST_PROPS}
          onSegmentClick={stub}
        />
      </SVGWrapper>
    ));

    /**
     * Second element should be "gap" segment when "gap" prop was provided
     */
    const gapSegment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[1];

    expect(gapSegment).toHaveAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP, String(CHART_TEST_PROPS.gap));

    userEvent.click(gapSegment);

    expect(stub).not.toHaveBeenCalled();
  });

  it('"onFocus" handler fires no events on "gap" segment', () => {
    expect.assertions(2);

    const stub = jest.fn();

    const { getAllByTestId } = render((
      <SVGWrapper>
        <Chart
          {...CHART_TEST_PROPS}
          setFocusedSegment={stub}
        />
      </SVGWrapper>
    ));

    /**
     * Second element should be "gap" segment when "gap" prop was provided
     */
    const gapSegment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[1];

    expect(gapSegment).toHaveAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP, String(CHART_TEST_PROPS.gap));

    fireEvent.focus(gapSegment);

    expect(stub).not.toHaveBeenCalled();
  });

  it('"onKeyDownCapture" handler fires no events on "gap" segment', () => {
    expect.assertions(2);

    const stub = jest.fn();

    const { getAllByTestId } = render((
      <SVGWrapper>
        <Chart
          {...CHART_TEST_PROPS}
          onSegmentKeyEnterDown={stub}
        />
      </SVGWrapper>
    ));

    /**
     * Second element should be "gap" segment when "gap" prop was provided
     */
    const gapSegment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[1];

    expect(gapSegment).toHaveAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP, String(CHART_TEST_PROPS.gap));

    fireEvent.keyDown(gapSegment, {
      code: 13,
      key: 'Enter',
    });

    expect(stub).not.toHaveBeenCalled();
  });

  it('"onMouseDown" handler fires no events on "gap" segment', () => {
    expect.assertions(2);

    const stub = jest.fn();

    const { getAllByTestId } = render((
      <SVGWrapper>
        <Chart
          {...CHART_TEST_PROPS}
          onSegmentKeyEnterDown={stub}
        />
      </SVGWrapper>
    ));

    /**
     * Second element should be "gap" segment when "gap" prop was provided
     */
    const gapSegment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[1];

    expect(gapSegment).toHaveAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP, String(CHART_TEST_PROPS.gap));

    fireEvent.mouseDown(gapSegment);

    expect(stub).not.toHaveBeenCalled();
  });

  it('"onMouseOverCapture" handler fires no events on "gap" segment', () => {
    expect.assertions(2);

    const stub = jest.fn();

    const { getAllByTestId } = render((
      <SVGWrapper>
        <Chart
          {...CHART_TEST_PROPS}
          onSegmentKeyEnterDown={stub}
        />
      </SVGWrapper>
    ));

    /**
     * Second element should be "gap" segment when "gap" prop was provided
     */
    const gapSegment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[1];

    expect(gapSegment).toHaveAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP, String(CHART_TEST_PROPS.gap));

    fireEvent.mouseOver(gapSegment);

    expect(stub).not.toHaveBeenCalled();
  });

  it('"onMouseUp" handler fires no events on "gap" segment', () => {
    expect.assertions(2);

    const stub = jest.fn();

    const { getAllByTestId } = render((
      <SVGWrapper>
        <Chart
          {...CHART_TEST_PROPS}
          onSegmentKeyEnterDown={stub}
        />
      </SVGWrapper>
    ));

    /**
     * Second element should be "gap" segment when "gap" prop was provided
     */
    const gapSegment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[1];

    expect(gapSegment).toHaveAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP, String(CHART_TEST_PROPS.gap));

    fireEvent.mouseUp(gapSegment);

    expect(stub).not.toHaveBeenCalled();
  });
});
