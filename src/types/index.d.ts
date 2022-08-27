/* eslint-disable @typescript-eslint/naming-convention */
import {
  CSSProperties,
  ReactNode,
  RefObject,
} from 'react';

/**
 * Chart container ref
 */
export type PieDonutChartPropRef = RefObject<HTMLElement>;

/**
 * Chart size
 */
export type PieDonutChartPropSize = number ;

/**
 * Chart data item type (chart segment)
 * @typedef { Object } DataItem
 *
 * The color of the chart segment. Must be CSS type 'color'
 * Default generated automatically
 * @property { string } color
 * @default undefined
 *
 * Order of segments in a chart
 * Default generated automatically
 * @property { number } order
 * @default undefined
 *
 * The unique ID of the chart segment
 * Default generated automatically
 * @property { string } segmentId
 * @default undefined
 *
 * REQUIRED. Segment value
 * @property { number } value
 */
export type DataItem = {
  color?: string;
  id?: string;
  order?: number;
  value: number;
};


/**
 * Chart elements [class~] props
 * @typedef { Object } PieDonutChartPropsClassNames
 *
 *
 * --------------- Optional ---------------
 *
 *
 * Chart background className.
 * Background - svg element the same size as the chart,
 * and it is rendered if 'colorSegmentsBackground' property is provided
 * @property { string } chartBackground
 * @default undefined
 *
 * Center circle (donut hole) className
 * @property { string } chartCenter
 * @default undefined
 *
 * Chart segment className
 * @property { string } chartSegment
 * @default undefined
 *
 * Chart segment background className
 * @property { string } chartSegmentsBackground
 * @default undefined
 *
 * Chart children className
 * @property { string } children
 * @default undefined
 *
 * Chart segments group <g> element className
 * @property { string } svgGroupSegments
 * @default undefined
 *
 * Chart segments group <g> element className.
 * This background is another <g> element under the chart segments group <g> element
 * @property { string } svgGroupSegmentsBackground
 * @default undefined
 *
 * Chart text group <g> element className
 * @property { string } svgGroupText
 * @default undefined
 *
 * Chart text <foreignObject> element className.
 * <foreignObject> is something like element-wrapper for the text container
 * @property { string } svgObjectText
 * @default undefined
 *
 * Text <div> container className
 * @property { string } text
 * @default undefined
 *
 */
export type PieDonutChartPropsClassNames = {
  chartBackground?: string;
  chartCenter?: string;
  chartSegment?: string;
  chartSegmentsBackground?: string;
  children?: string;
  svgGroupSegments?: string;
  svgGroupSegmentsBackground?: string;
  svgGroupText?: string;
  svgObjectText?: string;
  text?: string;
};

/**
 * Chart elements [color~] props
 * @typedef { Object } PieDonutChartPropsColors
 *
 *
 * --------------- Optional ---------------
 *
 *
 * Color of the chart background.
 * Background is svg element same size with chart.
 * Not renders if this param was not passed
 * @property { string } chartBackground
 * @default undefined
 *
 * Center circle (donut hole) color
 * @property { string } chartCenter
 * @default '#ffffff'
 *
 * Focused segments outline (stroke) color
 * @property { string } segmentFocusedOutline
 * @default '#287bc8'
 *
 * Background color of the chart segments background element.
 * "Segments background" is an svg element same size with chart.
 * > 1. Not renders if this param was not passed
 * > 2. This is not the segments background. This is background of element under all segments.
 * > Sounds complicated, I know... But it needed if you want to create a chart with gaps between segments
 * > and to color this space (gap) between segments. When the chart is "Pie" type this param works same like
 * > 'colorChartBackground' prop, but if chart is "Donut" type then current param will color
 * > only the circle under the segments but not the whole chart
 * @property { string } segmentsBackground
 * @default undefined
 *
 * The color of the text.
 * By default, it will be same color with selected segment (if any segment is selected)
 * or same color with the biggest value in the "data" array.
 * @property { string } text
 * @default undefined
 *
 */
export type PieDonutChartPropsColors = {
  chartBackground?: string;
  chartCenter?: string;
  segmentFocusedOutline?: string;
  segmentsBackground?: string;
  text?: string;
};

/**
 * Type of chart props
 * @typedef { Object } PieDonutChartProps
 *
 *
 * --------------- REQUIRED ---------------
 *
 *
 * Chart data
 * REQUIRED. Chart data
 * @property { Array<DataItem> } data;
 *
 * Ref to the parent `HTMLElement`
 * REQUIRED if "size" was not provided, and not allowed if "size" was provided
 * @property { RefObject<HTMLElement> } parentRef;
 *
 * Chart size
 * REQUIRED if "parentRef" was not provided, and not allowed if "parentRef" was provided
 * @property { number } size;
 *
 *
 * --------------- Optional ---------------
 *
 *
 * The speed (in milliseconds) of the animation when the values of the chart element change
 * @property { number } animationSpeed
 * @default 200
 *
 * The name of the chart center class.
 * The "chart center" is the svg element above the main chart. It's kind of like a text background.
 * "Chart center" will not be shown without "chartCenterSize" parameter.
 * > Don't use it if you just want to create a donut-type chart,
 * > it's better to pass the parameter "donutThickness" instead
 * @property { number } chartCenterSize
 * @default undefined
 *
 * "Children" to render in the center of the chart.
 * @property { ReactNode | string | number } children
 * @default undefined
 *
 * Main <SVG> className
 * @property { string } className
 * @default undefined
 *
 * Chart elements classNames
 * @property { PieDonutChartPropsClassNames } classNames
 * @default undefined
 *
 * Chart elements colors
 * @property { PieDonutChartPropsColors } colors
 * @default undefined
 *
 * Prevents unnecessary re-renders.
 * Debounce is disabled when 'resizeReRenderDebounceTime' = 0
 * or when the value of the "size" property is set
 * @property { number } resizeReRenderDebounceTime
 * @default 50
 *
 * The thickness of the donut segments.
 * You should pass this prop if you want to create a donut chart.
 * @property { number } donutThickness
 * @default undefined
 *
 * The font size.
 * By default, it calculates automatically to fit the size of the whole chart (outer radius) if the chart is "Pie" type.
 * If the chart is "Donut" type this param calculates automatically to fit the size of "donut hole" (inner radius).
 * @property { number } fontSize
 * @default undefined
 *
 * Gap between segments
 * @property { number } gap
 * @default undefined
 *
 * The ratio of the "scale" of the segment when it's hovered, selected or focused
 * @property { number } hoverScaleRatio
 * @default 1.05
 *
 * Enables or disables "scale" of the segment when it's hovered, active or focused
 * @property { boolean } isScaleOnHover
 * @default true
 *
 * Enables or disables segment selection on click on it
 * @property { boolean } isSelectOnClick
 * @default true
 *
 * Enables or disables segment selection on "enter" key press on it
 * @property { boolean } isSelectOnKeyEnterDown
 * @default true
 *
 * Enables or disables the display of the value of the selected segment in the center of the chart
 * @property { boolean } isSelectedValueShownInCenter
 * @default true
 *
 * Chart maximum size.
 * @property { number } maxSize
 * @default undefined
 *
 * Chart minimum size
 * @property { number } minSize
 * @default undefined
 *
 * Your own styles for hovered, selected or focused segments
 * @property { CSSProperties } stylesHoveredSegment
 * @default undefined
 *
 * Callback for segment "onClick" event
 * @property { (segmentId: string) => void } onSegmentClick
 * @default undefined
 *
 * Callback for segment "onKeydown" event
 * > Fires only for the "enter" key
 * @property { (segmentId: string) => void } onSegmentKeyEnterDown
 * @default undefined
 *
 * Selected segment ID
 * > In most cases you don't need it. But if you want to control this state manually - welcome =)
 * @property { string } selected
 * @default undefined
 *
 * The width of the "outline" (stroke) of the focused segment.
 * By default, it automatically resizes based on chart size and has a ratio of 0.0066.
 * This means that this stroke width = <chart_size> * 0.0066
 * @property { number } widthSegmentFocusedOutline
 * @default 4
 *
 * Enables or disables chart navigation with a "tab".
 * Default - accessible - you can navigate the chart with the keyboard ("tab" button)
 * And in most cases there is no reason to change it.
 * @property { number } tabIndex
 * @default 0
 *
 * Text to show in the center of the chart.
 * By default, it shows the total value of the provided "data"
 * or the value of the selected segment or the value of the focused segment
 * @property { string } text
 * @default undefined
 *
 */
export type PieDonutChartProps = {
  animationSpeed?: number;
  chartCenterSize?: number;
  children?: ReactNode | string | number;
  className?: string;
  classNames?: PieDonutChartPropsClassNames,
  colors?: PieDonutChartPropsColors,
  data: DataItem[];
  donutThickness?: number;
  fontSize?: number;
  gap?: number;
  hoverScaleRatio?: number;
  isScaleOnHover?: boolean;
  isSelectOnClick?: boolean;
  isSelectOnKeyEnterDown?: boolean;
  isSelectedValueShownInCenter?: boolean;
  maxSize?: number;
  minSize?: number;
  onSegmentClick?: (segmentId: string) => void;
  onSegmentKeyEnterDown?: (segmentId: string) => void;
  resizeReRenderDebounceTime?: number;
  selected?: string;
  stylesHoveredSegment?: CSSProperties;
  tabIndex?: number;
  text?: string;
  widthSegmentFocusedOutline?: number;
}  & (
  {
    parentRef?: never;
    size: PieDonutChartPropSize;
  } | {
    parentRef: PieDonutChartPropRef;
    size?: never;
  }
);

/**
 *
 * This lightweight library allows you to create "pie" and "donut" charts easily. 100% Tests-covered
 *
 * The chart component has very flexible settings. It can accept a passed size
 * or automatically adjust to the size of the parent component.
 * Moreover, this component is accessible.
 *
 * More information about all props you can find in the repo: https://github.com/garvae/react-pie-donut-chart
 *
 *
 * Component accept props type of 'PieDonutChartProps'.
 * @component
 * @param { PieDonutChartProps } props
 *
 * You can import 'PieDonutChartProps' type if you need:
 * ```typescript jsx
 * import { PieDonutChartProps } from 'PieDonutChart';
 * ```
 *
 * Returns <svg> chart.
 * @returns {JSX.Element}
 *
 *
 *
 * @example - basic usage. More examples: https://github.com/garvae/react-pie-donut-chart
 *
 * ```typescript jsx
 * import PieDonutChart, { DataItem } from '@garvae/react-pie-donut-chart';
 * import React from 'react';
 *
 * const DATA: DataItem[] = [
 *     {
 *         color: '#287BC8',
 *         id: '001',
 *         order: 1,
 *         value: 10,
 *     },
 *     {
 *         color: '#D64045',
 *         id: '002',
 *         order: 2,
 *         value: 40,
 *     },
 *     {
 *         color: '#daf6ec',
 *         id: '003',
 *         order: 3,
 *         value: 30,
 *     },
 *     {
 *         color: '#9ED8DB',
 *         id: '004',
 *         order: 4,
 *         value: 20,
 *     },
 *     {
 *         color: '#2B2D42',
 *         id: '005',
 *         order: 5,
 *         value: 50,
 *     },
 * ];
 *
 * // "Pie" type chart variant with "parentRef" prop (auto-resize)
 * const ChartPieAutoResize = () => {
 *     const ref = React.useRef<HTMLDivElement>(null);
 *
 *     return (
 *         <div
 *             ref={ref}
 *             style={{ height: '300px', width: '300px' }}
 *         >
 *             <PieDonutChart
 *                 data={DATA}
 *                 parentRef={ref}
 *             />
 *         </div>
 *     );
 * };
 *
 * // "Pie" type chart variant with "size" prop (no auto-resize)
 * const ChartPieWithFixedSize = () => {
 *     return (
 *         <PieDonutChart
 *             data={DATA}
 *             size={300}
 *         />
 *     );
 * };
 *
 * // "Donut" type chart variant with "size" prop (no auto-resize)
 * const ChartDonutWithFixedSize = () => {
 *     return (
 *         <PieDonutChart
 *             data={DATA}
 *             gap={10}
 *             size={300}
 *         />
 *     );
 * };
 * ```
 *
 * @author Garvae - https://github.com/garvae
 */
declare function PieDonutChart(props: PieDonutChartProps): JSX.Element;
exports.PieDonutChart = PieDonutChart;
export = PieDonutChart;
/* eslint-enable @typescript-eslint/naming-convention */
