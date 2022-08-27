import {
  consoleError,
  createErrorWithDescription,
} from 'utils/console';
import { TCreateChartSegmentPathDraw } from 'utils/createChartSegmentPathDraw/createChartSegmentPathDraw.types';

/**
 * Checks the validness of incoming params
 * @function checkIncomingValues
 * @param { TCreateChartSegmentPathDraw } props
 */
export const checkIncomingValues = (props: TCreateChartSegmentPathDraw) => {

  const {
    radiusInner,
    radiusOuter,
    size,
    valueSegment,
    valueSegmentsPreviousTotal,
    valueSegmentsTotal,
  } = props;

  const isNotValid = isNaN(valueSegment)
    || isNaN(valueSegmentsPreviousTotal)
    || isNaN(size)
    || isNaN(valueSegmentsTotal)
    || isNaN(radiusOuter)
    || isNaN(radiusInner)
    || valueSegment > valueSegmentsTotal
    || valueSegmentsPreviousTotal > valueSegmentsTotal
    || radiusOuter > size
    || radiusInner > size
    || radiusInner > radiusOuter;

  if (isNotValid) {
    consoleError(createErrorWithDescription({
      messageMain: 'In most cases, this error is caused by invalid props.',
      report: `
      One of the checks failed:
      
      isNaN(valueSegment)
      || isNaN(valueSegmentsPreviousTotal)
      || isNaN(size)
      || isNaN(valueSegmentsTotal)
      || isNaN(radiusOuter)
      || isNaN(radiusInner)
      || valueSegment > valueSegmentsTotal
      || valueSegmentsPreviousTotal > valueSegmentsTotal
      || radiusOuter > size
      || radiusInner > size
      || radiusInner > radiusOuter
      
      
      Error in: "checkIncomingValues" function
      Received values: 
      
      ${props}
      `,
    }));

    return false;
  }

  return true;
};
