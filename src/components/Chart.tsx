import React from 'react';

import { TUseChartPropsReturn } from 'hooks/useChartProps';
import { convertPercentToDegrees } from 'utils/createChartSegmentPathDraw/_utils/convertPercentToDegrees';
import { createChartSegmentPathDraw } from 'utils/createChartSegmentPathDraw/createChartSegmentPathDraw';
import { isKeyDownEnter } from 'utils/isKeyDownEnter';
import { sanitizeNumber } from 'utils/sanitizeNumber';
import {
  SINGLE_VALUE_CORRECTION_RATIO,
  DEFAULT_COLOR_SEGMENT_FOCUSED_OUTLINE,
} from 'variables/defaults';

/** segment offset correction angle */
export const SEGMENT_OFFSET_CORRECTION_ANGLE = 90;

export const TEST_DATA_ID_CHART_GROUP_SEGMENTS = 'TEST_DATA_ID_CHART_GROUP_SEGMENTS';
export const TEST_DATA_ID_CHART_GROUP_SEGMENT = 'TEST_DATA_ID_CHART_GROUP_SEGMENT';
export const TEST_DATA_ATTR_CHART_GROUP_SEGMENT_ID = 'data-test-id';
export const TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP = 'data-test-gap';
export const TEST_DATA_ATTR_CHART_GROUP_SEGMENT_THICKNESS = 'data-test-thickness';
export const TEST_DATA_ATTR_CHART_GROUP_SEGMENT_SELECTED = 'data-test-selected';

export type TChartProps = Pick<TUseChartPropsReturn,
'chartRef'
| 'classNameChartSegment'
| 'classNameSvgGroupSegments'
| 'colorSegmentFocusedOutline'
| 'data'
| 'donutThickness'
| 'focusedSegment'
| 'gap'
| 'handleClearSelects'
| 'hoverScaleRatio'
| 'hoveredSegment'
| 'isScaleOnHover'
| 'isSelectOnClick'
| 'isSelectOnKeyEnterDown'
| 'mouseDownSegment'
| 'stylesHoveredSegment'
| 'onSegmentClick'
| 'onSegmentKeyEnterDown'
| 'radius'
| 'segmentsStyles'
| 'selected'
| 'setFocusedSegment'
| 'setHoveredSegment'
| 'setMouseDownSegment'
| 'setSelected'
| 'size'
| 'strokeWidth'
| 'tabIndex'
| 'totalDataValue'
>;

/**
 * Main chart component
 * @component Chart
 * @param { TChartProps } props
 * @returns { JSX.Element } returns svg group <g> of <path> (segments)
 */
export const Chart = (props: TChartProps) => {

  const {
    chartRef,
    classNameChartSegment,
    classNameSvgGroupSegments,
    colorSegmentFocusedOutline,
    data,
    donutThickness,
    focusedSegment,
    gap,
    handleClearSelects,
    hoverScaleRatio,
    hoveredSegment,
    isScaleOnHover,
    isSelectOnClick,
    isSelectOnKeyEnterDown,
    mouseDownSegment,
    onSegmentClick,
    onSegmentKeyEnterDown,
    radius,
    segmentsStyles,
    selected,
    setFocusedSegment,
    setHoveredSegment,
    setMouseDownSegment,
    setSelected,
    size,
    strokeWidth,
    stylesHoveredSegment,
    tabIndex,
    totalDataValue,
  } = props;

  if (!data.length) {
    return null;
  }

  return (
    <g
      className={classNameSvgGroupSegments}
      data-testid={TEST_DATA_ID_CHART_GROUP_SEGMENTS}
      onBlurCapture={handleClearSelects}
      onMouseLeave={
        () => {
          if (hoveredSegment) {
            setHoveredSegment(null);
          }
        }
      }
      ref={chartRef}
    >
      {
        data.map((item, i) => {

          /**
           * if current segment is a gap
           */
          const isGapSegment = !!gap && i % 2 !== 0;

          const {
            color,
            id,
            value: valueParam,
          } = item;

          let value = valueParam;

          /**
           * correction when only one item in data
           */
          if (data.length === 1) {
            value = value * SINGLE_VALUE_CORRECTION_RATIO;
          }

          /**
           * the sum of previous segments values
           */
          let prevTotal = 0;

          if (i > 0) {
            prevTotal = data
              ?.filter((_, index) => index < i)
              ?.reduce((c, n) => c + n.value, 0) || 0;
          }


          /**
           * the proportion of previous segments
           */
          const prevTotalPercentage = sanitizeNumber(prevTotal) / sanitizeNumber(totalDataValue, 1) * 100;

          /**
           * the proportion of the current segment
           */
          const currentPercentage = sanitizeNumber(value) / sanitizeNumber(totalDataValue, 1) * 100;

          /**
           * the offset of the current segment
           * + corrections depends on index and svg rotation
           */
          let segmentOffset = convertPercentToDegrees({ percent: currentPercentage }) - SEGMENT_OFFSET_CORRECTION_ANGLE;

          if (i !== 0) {
            segmentOffset = segmentOffset + convertPercentToDegrees({ percent: prevTotalPercentage });
          }

          /**
           * is current segment selected
           */
          const isSelected = selected === id;

          /**
           * is current segment hovered
           */
          const isHovered = hoveredSegment === id;

          /**
           * is current segment focused
           */
          const isFocused = focusedSegment === id;

          /**
           * is mouse down on current segment
           */
          const isMouseDown = mouseDownSegment === id;

          /**
           * the 'transform' of the current segment
           */

          let transform = `rotate(${segmentOffset}deg) scale(1)`;

          if (!isGapSegment && (isSelected || isFocused || (isScaleOnHover && isHovered))) {
            transform = `rotate(${segmentOffset}deg) scale(${hoverScaleRatio})`;
          }

          /**
           * className
           */
          const classNameSegmentDefault = 'PieDonutChart__segment';
          const classNameSegment = classNameChartSegment
            ? `${classNameSegmentDefault} ${classNameChartSegment}`
            : classNameSegmentDefault;

          /**
           * stroke on focus
           */
          let stroke = undefined;

          if (!isGapSegment && isFocused && !isMouseDown) {
            stroke = colorSegmentFocusedOutline || DEFAULT_COLOR_SEGMENT_FOCUSED_OUTLINE;
          }

          /**
           * create the segment path
           */
          const segmentPath = createChartSegmentPathDraw({
            radiusInner: donutThickness ? radius - donutThickness : 0,
            radiusOuter: radius,
            size,
            valueSegment: value,
            valueSegmentsPreviousTotal: prevTotal,
            valueSegmentsTotal: totalDataValue,
          });

          /**
           * Tests attributes (gap segments)
           */
          const testsAttributesGap = { [TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP]: gap };

          /**
           * Tests attributes
           */
          const testsAttributes = {
            [TEST_DATA_ATTR_CHART_GROUP_SEGMENT_ID]: id,
            [TEST_DATA_ATTR_CHART_GROUP_SEGMENT_SELECTED]: isSelected,
            [TEST_DATA_ATTR_CHART_GROUP_SEGMENT_THICKNESS]: donutThickness,
            ...(isGapSegment ? testsAttributesGap : {}),
          };

          return (
            <path
              {...testsAttributes}
              className={classNameSegment}
              d={segmentPath}
              data-testid={TEST_DATA_ID_CHART_GROUP_SEGMENT}
              fill={color}
              key={`chart-segment-${id}`}
              onClick={
                () => {
                  if (isGapSegment) {
                    return;
                  }

                  if (isSelectOnClick && selected !== id) {
                    setSelected(id);
                  }

                  onSegmentClick?.(id);
                }
              }
              onFocus={
                () => {
                  if (isGapSegment) {
                    return;
                  }

                  if (focusedSegment !== id) {
                    setFocusedSegment(id);
                  }
                }
              }
              onKeyDownCapture={
                e => {
                  if (isGapSegment) {
                    return;
                  }

                  /**
                   * fires only if key === 'enter'
                   */
                  if (isKeyDownEnter(e)) {
                    if (isSelectOnKeyEnterDown && selected !== id) {
                      setSelected(id);
                    }

                    onSegmentKeyEnterDown?.(id);
                  }
                }
              }
              onMouseDown={
                () => {
                  if (isGapSegment) {
                    return;
                  }

                  if (mouseDownSegment !== id) {
                    setMouseDownSegment(id);
                  }
                }
              }
              onMouseOverCapture={
                () => {
                  if (isGapSegment) {
                    return;
                  }

                  if (hoveredSegment !== id) {
                    setHoveredSegment(id);
                  }
                }
              }
              onMouseUp={
                e => {
                  if (isGapSegment) {
                    return;
                  }

                  setMouseDownSegment(null);
                  e.currentTarget.blur();
                }
              }
              stroke={stroke}
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={isGapSegment ? 0 : strokeWidth}
              style={
                {
                  ...segmentsStyles,
                  cursor: isGapSegment ? 'initial' : 'pointer',
                  outline: 'none',
                  transform,
                  transitionProperty: 'all',
                  ...(!isGapSegment && isHovered && stylesHoveredSegment ? stylesHoveredSegment : {}),
                }
              }
              tabIndex={isGapSegment ? -1 : tabIndex}
            />
          );
        })
      }
    </g>
  );
};
