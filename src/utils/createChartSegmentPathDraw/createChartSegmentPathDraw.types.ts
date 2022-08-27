/**
 * @typedef { Object } TCreateChartSegmentPathDraw
 * @property { number } radiusInner                - inner radius if chart's type is "Donut"
 * @property { number } radiusOuter                - outer radius
 * @property { number } size                       - chart size
 * @property { number } valueSegment               - value of the chart's segment
 * @property { number } valueSegmentsPreviousTotal - value of all previous chart's segments
 * @property { number } valueSegmentsTotal         - total value of all chart's segments
 */
export type TCreateChartSegmentPathDraw = {
  radiusInner: number;
  radiusOuter: number;
  size: number;
  valueSegment: number;
  valueSegmentsPreviousTotal: number;
  valueSegmentsTotal: number;
};
