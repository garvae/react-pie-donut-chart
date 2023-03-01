import { useMemo } from 'react';

import { TDataItemRequired } from 'types/PieDonutChart.types.internal';


export type TUseChartSelectedSegment = {
  data: TDataItemRequired[];
  focusedSegment: string | null;
  isSelectedValueShownInCenter: boolean;
  selected: string | null;
};

/**
 * Determines if there is a selected segment in chart
 * @function useChartSelectedSegment (hook)
 * @param { TUseChartSelectedSegment } props
 * @return { TDataItemRequired | null } returns chart's selected segment
 */
export const useChartSelectedSegment = (props: TUseChartSelectedSegment): TDataItemRequired | null => {

  const {
    data,
    focusedSegment,
    isSelectedValueShownInCenter,
    selected,
  } = props;

  return useMemo(() => {
    if (!data || !Array.isArray(data) || !data.length || !isSelectedValueShownInCenter || (!focusedSegment && !selected)) {
      return null;
    }

    if (data.length === 1) {
      return data[0];
    }

    const s = data.find(item => item.id === focusedSegment || item.id === selected);

    if (!s) {
      return null;
    }

    return s;
  }, [
    data,
    focusedSegment,
    isSelectedValueShownInCenter,
    selected,
  ]);
};
