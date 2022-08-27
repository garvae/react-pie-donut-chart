import {
  useState,
  useCallback,
  useRef,
  RefObject,
  SetStateAction,
  Dispatch,
  useLayoutEffect,
} from 'react';

import { useClickOutside } from 'hooks/helpers/useClickOutside';
import { useIsMounted } from 'hooks/helpers/useIsMounted';
import { TPieDonutChartPropsInternal } from 'types/PieDonutChart.types.internal';

export const SAFETY_ANIMATION_DURATION_UPDATE_TIME = 100;

type TUseChartStates = {
  animationSpeed: TPieDonutChartPropsInternal['animationSpeed'];
};

type TUseChartStatesReturn = {
  animationDuration: number;
  chartRef: RefObject<SVGSVGElement>;
  focusedSegment: string | null;
  handleClearSelects: () => void;
  hoveredSegment: string | null;
  mouseDownSegment: string | null;
  selectedState: string | null;
  setAnimationDuration: Dispatch<SetStateAction<number>>;
  setFocusedSegment: Dispatch<SetStateAction<string | null>>;
  setHoveredSegment: Dispatch<SetStateAction<string | null>>;
  setMouseDownSegment: Dispatch<SetStateAction<string | null>>;
  setSelected: Dispatch<SetStateAction<string | null>>;
};

type TUpdateStateValue<T> = {
  setter: Dispatch<SetStateAction<T>>;
  value: SetStateAction<T>;
};

/**
 * Hook manages chart states
 * @function { (props: TUseChartStates) => TUseChartStatesReturn } useChartStates (hook)
 * @param { TUseChartStates } props
 */
export const useChartStates = (props: TUseChartStates): TUseChartStatesReturn => {

  const { animationSpeed: animationSpeedProp } = props;

  const chartRef = useRef<SVGSVGElement>(null);

  const isMounted = useIsMounted();

  const [ selectedState, setSelected ] = useState<string | null>(null);
  const [ mouseDownSegment, setMouseDownSegment ] = useState<string | null>(null);
  const [ focusedSegment, setFocusedSegment ] = useState<string | null>(null);
  const [ hoveredSegment, setHoveredSegment ] = useState<string | null>(null);
  const [ animationDuration, setAnimationDuration ] = useState<number>(0);

  const handleClearSelects = useCallback(() => {
    if (focusedSegment) {
      setFocusedSegment(null);
    }

    if (selectedState) {
      setSelected(null);
    }
  }, [
    focusedSegment,
    selectedState,
    setFocusedSegment,
    setSelected,
  ]);

  /**
   * Safety states update
   * @param {TUpdateStateValue} p
   */
  const updateStateValue = useCallback(<T>(p: TUpdateStateValue<T>) => {

    const {
      setter,
      value,
    } = p;

    if (isMounted()) {
      setter(value);
    }
  }, [ isMounted ]);

  useClickOutside({
    callback: handleClearSelects,
    isWithKeyEsc: true,
    ref: chartRef,
  });

  /**
   * Safely update "animationDuration" state avoiding animation bugs
   */
  useLayoutEffect(() => {
    if (typeof animationSpeedProp === 'number' && animationDuration !== animationSpeedProp) {

      const timeout = setTimeout(() => {
        updateStateValue<number>({
          setter: setAnimationDuration,
          value: animationSpeedProp,
        });
      }, SAFETY_ANIMATION_DURATION_UPDATE_TIME);

      return () => {
        clearTimeout(timeout);
      };
    }

    return undefined;
  }, [
    animationDuration,
    animationSpeedProp,
    updateStateValue,
  ]);


  return {
    animationDuration,
    chartRef,
    focusedSegment,
    handleClearSelects,
    hoveredSegment,
    mouseDownSegment,
    selectedState,
    setAnimationDuration: value => updateStateValue<number>({
      setter: setAnimationDuration,
      value,
    }),
    setFocusedSegment: value => updateStateValue<string | null>({
      setter: setFocusedSegment,
      value,
    }),
    setHoveredSegment: value => updateStateValue<string | null>({
      setter: setHoveredSegment,
      value,
    }),
    setMouseDownSegment: value => updateStateValue<string | null>({
      setter: setMouseDownSegment,
      value,
    }),
    setSelected: value => updateStateValue<string | null>({
      setter: setSelected,
      value,
    }),
  };
};
