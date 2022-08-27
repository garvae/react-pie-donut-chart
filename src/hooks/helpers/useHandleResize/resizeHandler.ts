import { TPieDonutChartPropsInternal } from 'types/PieDonutChart.types.internal';

export type TResizeHandler = {
  maxSize: TPieDonutChartPropsInternal['maxSize'];
  minSize: TPieDonutChartPropsInternal['minSize'];
  parentRef: TPieDonutChartPropsInternal['parentRef'];
  size: TPieDonutChartPropsInternal['size'];
  updateSize: (newSize: number) => void;
};

/**
 * Resize handler
 * Checks if new size is can be calculated, if it's valid when calculated
 * and fires callback when new valid size calculated
 */
export const resizeHandler = (props: TResizeHandler) => {
  const {
    maxSize,
    minSize,
    parentRef,
    size,
    updateSize,
  } = props;

  const {
    offsetHeight,
    offsetWidth,
  } = parentRef?.current || {};

  const h = offsetHeight || size;
  const w = offsetWidth || size;

  if (typeof h !== 'number' || typeof w !== 'number') {
    return;
  }

  let s = 0;

  if (h === w && w > 0) {
    s = h;
  } else if (h > 0 && w > 0) {
    s = h > w ? w : h;
  } else if (h && h > 0) {
    s = h;
  } else if (w && w > 0) {
    s = w;
  }

  if (s) {
    if (minSize && (minSize >= s)) {
      updateSize(minSize);
    } else if (maxSize && (maxSize <= s)) {
      updateSize(maxSize);
    } else {
      updateSize(s);
    }
  } else if (minSize) {
    updateSize(minSize);
  } else {
    updateSize(0);
  }
};
