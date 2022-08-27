import {
  useEffect,
  useMemo,
} from 'react';

import { useHandleResize } from 'hooks/helpers/useHandleResize/useHandleResize';
import { useChartDataRemap } from 'hooks/useChartDataRemap';
import { useChartParams } from 'hooks/useChartParams';
import { useChartSelectedSegment } from 'hooks/useChartSelectedSegment';
import { useChartStates } from 'hooks/useChartStates';
import { TPieDonutChartPropsInternal } from 'types/PieDonutChart.types.internal';
import { checkPropsErrors } from 'utils/checkPropsErrors';
import { getCurrentFontSize } from 'utils/getCurrentFontSize';
import {
  DEFAULT_FOCUSED_SEGMENT_STROKE_WIDTH_TO_SIZE_RATIO,
  DEFAULT_CHART_CENTER_COLOR,
  DEFAULT_CHART_SEGMENT_SCALE_RATIO,
  DEFAULT_RESIZE_RE_RENDER_DEBOUNCE_TIME,
  DEFAULT_ANIMATION_SPEED,
} from 'variables/defaults';

/**
 * Describes properties for the "useChartProps" hook
 * @typedef { Object } TUseChartProps
 *
 * @property { TPieDonutChartPropsInternal } props - incoming chart properties
 */
type TUseChartProps = {
  props: TPieDonutChartPropsInternal
};

/**
 * Collects and processes all incoming and internal-calculated chart params
 * @function useChartProps (hook)
 * @param { TUseChartProps } props
 * @return all params for chart
 */
export const useChartProps = (props: TUseChartProps) => {

  const { props: properties } = props;

  const {
    animationSpeed = DEFAULT_ANIMATION_SPEED,
    chartCenterSize,
    children,
    className,
    classNameChartBackground,
    classNameChartCenter,
    classNameChartSegment,
    classNameChartSegmentsBackground,
    classNameChildren,
    classNameSvgGroupSegments,
    classNameSvgGroupSegmentsBackground,
    classNameSvgGroupText,
    classNameSvgObjectText,
    classNameText,
    colorChartBackground,
    colorChartCenter = DEFAULT_CHART_CENTER_COLOR,
    colorSegmentFocusedOutline,
    colorSegmentsBackground,
    colorText: colorTextProp,
    data: dataProp = [],
    donutThickness: donutThicknessProp = 0,
    fontSize: fontSizeProp,
    gap = 0,
    hoverScaleRatio = DEFAULT_CHART_SEGMENT_SCALE_RATIO,
    isScaleOnHover = true,
    isSelectOnClick = true,
    isSelectOnKeyEnterDown = true,
    isSelectedValueShownInCenter = true,
    maxSize,
    minSize,
    stylesHoveredSegment,
    onSegmentClick,
    onSegmentKeyEnterDown,
    parentRef,
    resizeReRenderDebounceTime = DEFAULT_RESIZE_RE_RENDER_DEBOUNCE_TIME,
    selected: selectedProp,
    size: sizeProp,
    tabIndex = 0,
    text: textProp,
    widthSegmentFocusedOutline,
  } = properties;

  const data = useChartDataRemap({
    data: dataProp,
    gap,
  });

  const {
    animationDuration,
    chartRef,
    focusedSegment,
    handleClearSelects,
    hoveredSegment,
    mouseDownSegment,
    selectedState,
    setAnimationDuration,
    setFocusedSegment,
    setHoveredSegment,
    setMouseDownSegment,
    setSelected,
  } = useChartStates({ animationSpeed });

  const selected = useChartSelectedSegment({
    data,
    focusedSegment,
    isSelectedValueShownInCenter,
    selected: selectedProp || selectedState,
  });

  const { size } = useHandleResize({
    animationDuration,
    maxSize,
    minSize,
    parentRef,
    resizeReRenderDebounceTime,
    setAnimationDuration,
    size: sizeProp,
  });

  const strokeWidth = useMemo(() => {
    if (widthSegmentFocusedOutline) {
      return widthSegmentFocusedOutline;
    }

    return size * DEFAULT_FOCUSED_SEGMENT_STROKE_WIDTH_TO_SIZE_RATIO;
  }, [ size, widthSegmentFocusedOutline ]);

  const {
    centerSize,
    colorText,
    donutThickness,
    radius,
    segmentsStyles,
    text,
    totalDataValue,
    viewBox,
  } = useChartParams({
    animationDuration,
    chartCenterSize,
    colorText: colorTextProp,
    data,
    donutThickness: donutThicknessProp,
    gap,
    isSelectedValueShownInCenter,
    selected,
    size,
    text: textProp,
  });

  /**
   * Chart font-size
   */
  const fontSize = useMemo(() => getCurrentFontSize({
    centerSize,
    donutThickness,
    fontSize: fontSizeProp,
    size,
    text,
  }), [
    centerSize,
    donutThickness,
    fontSizeProp,
    size,
    text,
  ]);

  useEffect(() => {
    checkPropsErrors(properties);
  }, [ properties ]);

  return {
    centerSize,
    chartRef,
    children,
    className,
    classNameChartBackground,
    classNameChartCenter,
    classNameChartSegment,
    classNameChartSegmentsBackground,
    classNameChildren,
    classNameSvgGroupSegments,
    classNameSvgGroupSegmentsBackground,
    classNameSvgGroupText,
    classNameSvgObjectText,
    classNameText,
    colorChartBackground,
    colorChartCenter,
    colorSegmentFocusedOutline,
    colorSegmentsBackground,
    colorText,
    data,
    donutThickness,
    focusedSegment,
    fontSize,
    gap,
    handleClearSelects,
    hoverScaleRatio,
    hoveredSegment,
    isScaleOnHover,
    isSelectOnClick,
    isSelectOnKeyEnterDown,
    minSize,
    mouseDownSegment,
    onSegmentClick,
    onSegmentKeyEnterDown,
    radius,
    segmentsStyles,
    selected: selected?.id,
    setFocusedSegment,
    setHoveredSegment,
    setMouseDownSegment,
    setSelected,
    size,
    strokeWidth,
    stylesHoveredSegment,
    tabIndex,
    text,
    totalDataValue,
    viewBox,
  };
};

export type TUseChartPropsReturn = ReturnType<typeof useChartProps>;
