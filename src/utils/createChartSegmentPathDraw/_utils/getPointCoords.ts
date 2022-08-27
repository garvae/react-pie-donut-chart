
/**
 * Describes properties for the "createSvgCommandsString" function
 * @typedef { Object } TGetStartPointCoords
 * @property { number } angleDegrees - current segment angle
 * @property { number } radius       - chart radius
 * @property { number } size         - chart size
 */
type TGetStartPointCoords = {
  angleDegrees: number;
  radius: number;
  size: number;
};

/**
 * Converts incoming params to the point coordinates
 * @function { (props: TGetStartPointCoords): string } getPointCoords
 * @param { TGetStartPointCoords } props
 * @return { string } coords 'x y'
 */
export const getPointCoords = (props: TGetStartPointCoords): string => {

  const {
    angleDegrees,
    radius,
    size,
  } = props;

  const halfSize = size / 2;
  const x = radius * Math.cos((angleDegrees * Math.PI) / 180) + halfSize;
  const y = - radius * Math.sin((angleDegrees * Math.PI) / 180) + halfSize;

  return `${x} ${y}`;
};
