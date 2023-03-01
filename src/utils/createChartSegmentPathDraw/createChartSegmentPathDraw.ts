import { checkIncomingValues } from 'utils/createChartSegmentPathDraw/_utils/checkIncomingValues';
import { createSvgCommandsString } from 'utils/createChartSegmentPathDraw/_utils/createSvgCommandsString';
import { TCreateChartSegmentPathDraw } from 'utils/createChartSegmentPathDraw/createChartSegmentPathDraw.types';

/**
 * Prepares data for the chart segment path calculations
 * @function createChartSegmentPathDraw
 * @param { TCreateChartSegmentPathDraw } props
 * @return { string } path
 */
export const createChartSegmentPathDraw = (props: TCreateChartSegmentPathDraw) => {

  const {
    radiusInner,
    radiusOuter,
    size,
    valueSegment,
    valueSegmentsPreviousTotal,
    valueSegmentsTotal,
  } = props;

  if (!checkIncomingValues(props)) {
    return '';
  }

  /**
   * proportion of previous segments
   */
  const ratioPrev = valueSegmentsPreviousTotal / (valueSegmentsTotal || 1);

  /**
   * proportion of the current segment to total chart
   */
  const ratioCurrent = valueSegment / (valueSegmentsTotal || 1);

  /**
   * start angle of the current segment
   */
  const angleStartDegrees = 360 * ratioPrev;

  /**
   * end angle of the current segment
   */
  const angleEndDegrees = 360 * (ratioPrev + ratioCurrent);

  /**
   * angle of the current segment
   */
  const angleDegrees = angleEndDegrees - angleStartDegrees;

  return createSvgCommandsString({
    angleDegrees,
    radiusInner,
    radiusOuter,
    size,
  });
};
