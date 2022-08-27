import { getPointCoords } from 'utils/createChartSegmentPathDraw/_utils/getPointCoords';

/**
 * Describes properties for the "createSvgCommandsString" function
 * @typedef { Object } TCreateSvgCommandsString
 * @property { number } angleDegrees - current segment angle
 * @property { number } radiusInner  - inner radius if chart's type is "Donut"
 * @property { number } radiusOuter  - outer radius
 * @property { number } size         - chart size
 */
type TCreateSvgCommandsString = {
  angleDegrees: number;
  radiusInner: number;
  radiusOuter: number;
  size: number;
};

/**
 * Calculates chart segment path
 * @function createSvgCommandsString
 * @param { TCreateSvgCommandsString } props
 * @return { string } path
 */
export const createSvgCommandsString = (props: TCreateSvgCommandsString) => {
  const {
    angleDegrees,
    radiusInner,
    radiusOuter,
    size,
  } = props;

  /**
   * Here we determine which way the arc will be formed to the point - along a short or long one.
   */
  const longPathFlag = angleDegrees > 180 ? 1 : 0;

  const sizeHalf = size / 2;

  const commandM1 = `M ${sizeHalf + radiusOuter} ${sizeHalf}`;

  const coordsPointCommandA1 = getPointCoords({
    angleDegrees,
    radius: radiusOuter,
    size,
  });

  const commandA1 = `A ${radiusOuter} ${radiusOuter} 0 ${longPathFlag} 0 ${coordsPointCommandA1}`;

  const coordsPointCommandL1 = getPointCoords({
    angleDegrees,
    radius: radiusInner,
    size,
  });

  const commandL1 = `L ${coordsPointCommandL1}`;

  const commandA2 = `A ${radiusInner} ${radiusInner} 0 ${longPathFlag} 1 ${sizeHalf + radiusInner} ${sizeHalf}`;

  const coordsPointCommandL2 = getPointCoords({
    angleDegrees: 0,
    radius: radiusOuter,
    size,
  });

  const commandL2 = `L ${coordsPointCommandL2}`;

  return [
    commandM1,
    commandA1,
    commandL1,
    commandA2,
    commandL2,
  ].join(' ');
};
