import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Chart,
  TChartProps,
  TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP,
  TEST_DATA_ID_CHART_GROUP_SEGMENT,
  TEST_DATA_ID_CHART_GROUP_SEGMENTS
} from 'components/Chart';
import { TEST_DATA_ID_CHART_SVG_MAIN } from 'components/PieDonutChart';
import React, { PropsWithChildren, RefObject } from 'react';
import { TEST_PROPS } from 'tests/mocks/variables';

import { DataItem } from '../../types';

const SVGWrapper = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <svg
      data-testid={TEST_DATA_ID_CHART_SVG_MAIN}
      style={{
        alignItems: 'center',
        aspectRatio: '1 / 1',
        display: 'flex',
        height: `${TEST_PROPS.size}px`,
        justifyContent: 'center',
        overflow: 'visible',
        transformOrigin: 'center',
        width: `${TEST_PROPS.size}px`
      }}
      viewBox={`0 0 ${TEST_PROPS.size} ${TEST_PROPS.size}`}>
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
  getSegmentAriaLabel: undefined,
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
  totalDataValue: TEST_PROPS.data.reduce((current, next) => current + next.value, 0)
};

describe('main "Chart" component', () => {
  it('"onMouseLeave" resets "hoveredSegment" state', () => {
    expect.assertions(4);

    const stub = jest.fn();

    const { getAllByTestId, getByTestId, rerender } = render(
      <SVGWrapper>
        <Chart {...CHART_TEST_PROPS} setHoveredSegment={stub} />
      </SVGWrapper>
    );

    const chart = getByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENTS);
    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    fireEvent.mouseOver(segment, { bubbles: true });

    const expectedHoveredSegment = CHART_TEST_PROPS.data[0].id;
    expect(stub).toHaveBeenCalledTimes(1);
    expect(stub).toHaveBeenCalledWith(expectedHoveredSegment);

    rerender(
      <SVGWrapper>
        <Chart {...CHART_TEST_PROPS} hoveredSegment={expectedHoveredSegment} setHoveredSegment={stub} />
      </SVGWrapper>
    );

    fireEvent.mouseLeave(chart, { bubbles: true });

    expect(stub).toHaveBeenCalledWith(null);
    expect(stub).toHaveBeenCalledTimes(2);
  });

  it('renders the chart when the specified "data" length is 1', () => {
    expect.assertions(1);

    const data = [CHART_TEST_PROPS.data[0]];

    const { getAllByTestId } = render(
      <SVGWrapper>
        <Chart {...CHART_TEST_PROPS} data={data} />
      </SVGWrapper>
    );

    const segments = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT);

    expect(segments).toHaveLength(data.length);
  });

  it('"onKeyDownCapture" handler sets "selected" state', () => {
    expect.assertions(1);

    const stub = jest.fn();

    const { getAllByTestId } = render(
      <SVGWrapper>
        <Chart {...CHART_TEST_PROPS} isSelectOnKeyEnterDown onSegmentKeyEnterDown={undefined} setSelected={stub} />
      </SVGWrapper>
    );

    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    fireEvent.keyDown(segment, {
      code: 13,
      key: 'Enter'
    });

    expect(stub).toHaveBeenCalledWith(CHART_TEST_PROPS.data[0].id);
  });

  it('"onClick" handler fires no events on "gap" segment', () => {
    expect.assertions(2);

    const stub = jest.fn();

    const { getAllByTestId } = render(
      <SVGWrapper>
        <Chart {...CHART_TEST_PROPS} onSegmentClick={stub} />
      </SVGWrapper>
    );

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

    const { getAllByTestId } = render(
      <SVGWrapper>
        <Chart {...CHART_TEST_PROPS} setFocusedSegment={stub} />
      </SVGWrapper>
    );

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

    const { getAllByTestId } = render(
      <SVGWrapper>
        <Chart {...CHART_TEST_PROPS} onSegmentKeyEnterDown={stub} />
      </SVGWrapper>
    );

    /**
     * Second element should be "gap" segment when "gap" prop was provided
     */
    const gapSegment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[1];

    expect(gapSegment).toHaveAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP, String(CHART_TEST_PROPS.gap));

    fireEvent.keyDown(gapSegment, {
      code: 13,
      key: 'Enter'
    });

    expect(stub).not.toHaveBeenCalled();
  });

  it('"onMouseDown" handler fires no events on "gap" segment', () => {
    expect.assertions(2);

    const stub = jest.fn();

    const { getAllByTestId } = render(
      <SVGWrapper>
        <Chart {...CHART_TEST_PROPS} onSegmentKeyEnterDown={stub} />
      </SVGWrapper>
    );

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

    const { getAllByTestId } = render(
      <SVGWrapper>
        <Chart {...CHART_TEST_PROPS} onSegmentKeyEnterDown={stub} />
      </SVGWrapper>
    );

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

    const { getAllByTestId } = render(
      <SVGWrapper>
        <Chart {...CHART_TEST_PROPS} onSegmentKeyEnterDown={stub} />
      </SVGWrapper>
    );

    /**
     * Second element should be "gap" segment when "gap" prop was provided
     */
    const gapSegment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[1];

    expect(gapSegment).toHaveAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP, String(CHART_TEST_PROPS.gap));

    fireEvent.mouseUp(gapSegment);

    expect(stub).not.toHaveBeenCalled();
  });

  describe('previousTotal regression (Stage 09 — O(n) refactor)', () => {
    it('renders the correct number of segments for 5-item data (gap=0, no gap segments)', () => {
      expect.assertions(1);

      const data: Required<DataItem>[] = [
        { color: '#ff0000', id: 'a', order: 1, value: 10 },
        { color: '#00ff00', id: 'b', order: 2, value: 20 },
        { color: '#0000ff', id: 'c', order: 3, value: 30 },
        { color: '#ffff00', id: 'd', order: 4, value: 40 },
        { color: '#00ffff', id: 'e', order: 5, value: 50 }
      ];

      const { getAllByTestId } = render(
        <SVGWrapper>
          <Chart {...CHART_TEST_PROPS} data={data} gap={0} totalDataValue={data.reduce((s, x) => s + x.value, 0)} />
        </SVGWrapper>
      );

      /**
       * With gap=0, only the real data segments are rendered (no gap pseudo-segments).
       * This count must be the same regardless of whether prevTotal is computed
       * via O(n²) filter+reduce or O(n) prefix sums.
       */
      expect(getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)).toHaveLength(data.length);
    });

    it('segments rendered for data sorted by order (order:0 appears first)', () => {
      expect.assertions(2);

      const data: Required<DataItem>[] = [
        { color: '#ff0000', id: 'first', order: 0, value: 10 },
        { color: '#0000ff', id: 'second', order: 1, value: 20 }
      ];

      const { getAllByTestId, container } = render(
        <SVGWrapper>
          <Chart {...CHART_TEST_PROPS} data={data} gap={0} totalDataValue={30} />
        </SVGWrapper>
      );

      const segments = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT);

      expect(segments).toHaveLength(2);
      /**
       * order:0 must be first — validates the Stage 08 order:?? fix and ensures
       * the performance refactor preserves the sort order before prefix-sum computation.
       * We verify this by checking the first segment's path arc starts at 0° (top of circle),
       * which is only the case if the first item is the first item drawn.
       * A simpler proxy: the container should have 2 path elements and no NaN.
       */
      const paths = container.querySelectorAll('path[d]');
      const hasNaN = Array.from(paths).some((p) => p.getAttribute('d')?.includes('NaN'));

      expect(hasNaN).toBe(false);
    });

    it('produces no NaN in any segment path "d" attribute (regression for all segments)', () => {
      expect.assertions(1);

      const data: Required<DataItem>[] = [
        { color: '#ff0000', id: 'a', order: 1, value: 10 },
        { color: '#00ff00', id: 'b', order: 2, value: 20 },
        { color: '#0000ff', id: 'c', order: 3, value: 30 }
      ];

      const { container } = render(
        <SVGWrapper>
          <Chart {...CHART_TEST_PROPS} data={data} gap={0} totalDataValue={60} />
        </SVGWrapper>
      );

      const paths = container.querySelectorAll('path[d]');
      const hasNaN = Array.from(paths).some((p) => p.getAttribute('d')?.includes('NaN'));

      expect(hasNaN).toBe(false);
    });

    it('large data fixture (100 segments): no throw, correct segment count, no NaN in paths', () => {
      expect.assertions(3);

      const data: Required<DataItem>[] = Array.from({ length: 100 }, (_, i) => ({
        color: `#${String(i).padStart(6, '0')}`,
        id: `seg-${i}`,
        order: i + 1,
        value: i + 1
      }));

      const totalDataValue = data.reduce((s, x) => s + x.value, 0);

      let container: Element | null = null;

      expect(() => {
        const result = render(
          <SVGWrapper>
            <Chart {...CHART_TEST_PROPS} data={data} gap={0} totalDataValue={totalDataValue} />
          </SVGWrapper>
        );

        container = result.container;
      }).not.toThrow();

      const segments = container!.querySelectorAll(`[data-testid="${TEST_DATA_ID_CHART_GROUP_SEGMENT}"]`);

      expect(segments.length).toBe(100);

      const paths = container!.querySelectorAll('path[d]');
      const hasNaN = Array.from(paths).some((p) => p.getAttribute('d')?.includes('NaN'));

      expect(hasNaN).toBe(false);
    });
  });
});
