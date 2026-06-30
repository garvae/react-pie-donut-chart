import { resizeHandler } from 'hooks/helpers/useHandleResize/resizeHandler';
import { startResizeListener } from 'hooks/helpers/useHandleResize/startResizeListener/startResizeListener';
import { useIsMounted } from 'hooks/helpers/useIsMounted';
import { useIsomorphicLayoutEffect } from 'hooks/helpers/useIsomorphicLayoutEffect';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TPieDonutChartPropsInternal } from 'types/PieDonutChart.types.internal';
import { debounce } from 'utils/debounce';
import { isClient } from 'utils/env';
import { sanitizeNumber } from 'utils/sanitizeNumber';

export type TUseHandleResize = {
  animationDuration: number;
  maxSize: TPieDonutChartPropsInternal['maxSize'];
  minSize: TPieDonutChartPropsInternal['minSize'];
  parentRef: TPieDonutChartPropsInternal['parentRef'];
  resizeReRenderDebounceTime: number;
  setAnimationDuration: Dispatch<SetStateAction<number>>;
  size: TPieDonutChartPropsInternal['size'];
};

/**
 * Describes properties returned by "useHandleResize" hook
 * @typedef { Object } TUseHandleResizeReturn
 * @property { number } size - current chart size
 */
type TUseHandleResizeReturn = {
  size: number;
};

/**
 * Hook manages chart size param.
 * This hook listens for window or chart's container "resize" events,
 * and incoming chart's size props (maxSize, minSize, etc...) changes
 * @function useHandleResize (hook)
 * @param { TUseHandleResize } props
 * @return { TUseHandleResizeReturn } - current chart's params (size)
 */
export const useHandleResize = (props: TUseHandleResize): TUseHandleResizeReturn => {
  const {
    animationDuration,
    maxSize,
    minSize,
    parentRef,
    resizeReRenderDebounceTime,
    setAnimationDuration,
    size: sizeProp
  } = props;

  const isMounted = useIsMounted();
  const [size, setSize] = useState<number>(0);
  const [parentRefCurrent, setParentRefCurrent] = useState<HTMLElement | null>(null);
  const sizeRef = useRef(0);

  const processUpdate = useCallback(
    (newSize: number) => {
      if (isMounted()) {
        /**
         * Freezes animation to prevent unnecessary animation bugs while resize.
         * It will be restored automatically
         */
        if (animationDuration !== 0) {
          setAnimationDuration(0);
        }

        sizeRef.current = newSize;
        setSize(newSize);
      }
    },
    [animationDuration, isMounted, setAnimationDuration]
  );

  /**
   * debounced size updater
   */
  const updateSizeDebounced = useMemo(
    () =>
      debounce((newSize: number) => {
        processUpdate(newSize);
      }, resizeReRenderDebounceTime),
    [processUpdate, resizeReRenderDebounceTime]
  );

  useEffect(() => () => updateSizeDebounced.cancel(), [updateSizeDebounced]);

  /**
   * updates size
   */
  const updateSize = useCallback(
    (newSize: number) => {
      const n = sanitizeNumber(newSize, sizeRef.current);

      if (n === sizeRef.current) {
        return;
      }

      if (resizeReRenderDebounceTime === 0) {
        processUpdate(n);
      } else {
        updateSizeDebounced(n);
      }
    },
    [processUpdate, resizeReRenderDebounceTime, updateSizeDebounced]
  );

  /**
   * resize handler
   */
  const handleResize = useCallback(
    () =>
      resizeHandler({
        maxSize,
        minSize,
        parentRef,
        size: sizeProp,
        updateSize
      }),
    [maxSize, minSize, parentRef, sizeProp, updateSize]
  );

  /**
   * useResizeListener callback
   */

  /**
   * listens for the 'resize' custom event on the parent container
   */
  useIsomorphicLayoutEffect(
    () =>
      startResizeListener({
        cb: handleResize,
        node: parentRef?.current || null
      }),
    [handleResize, parentRef]
  );

  /**
   * fires handleResize on window's 'resize' event
   */
  useIsomorphicLayoutEffect(() => {
    if (isClient() && !sizeProp) {
      window.addEventListener('resize', handleResize) /* re-renders svg if parent container resized */;
      return () => window.removeEventListener('resize', handleResize);
    }

    return undefined;
  }, [handleResize, sizeProp]);

  /**
   * initializes size
   */
  useIsomorphicLayoutEffect(() => {
    const isReadyForSize = parentRef?.current || sizeProp;

    if (isClient() && isReadyForSize && !size) {
      handleResize();
    }

    return undefined;
  }, [handleResize, parentRef, size, sizeProp]);

  /**
   * Listen for "parentRef" prop changes
   */
  useEffect(() => {
    if (parentRef?.current && parentRefCurrent !== parentRef.current) {
      setParentRefCurrent(parentRef.current);
      handleResize();
    }
  }, [handleResize, parentRef, parentRefCurrent]);

  /**
   * Listen for "size" prop changes
   */
  useEffect(() => {
    if (sizeProp && size !== sizeProp) {
      handleResize();
    }
  }, [handleResize, parentRef, parentRefCurrent, size, sizeProp]);

  return { size };
};
