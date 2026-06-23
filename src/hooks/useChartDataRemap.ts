import { useMemo } from 'react';

import { TDataItemRequired, TPieDonutChartPropsInternal } from 'types/PieDonutChart.types.internal';
import { randomColorHEX } from 'utils/color';
import { consoleWarn } from 'utils/console';
import { generateUniqueID } from 'utils/id';

export const USE_CHART_DATA_REMAP_ERR_UNIQUE_ID_TEXT =
  'It recommended to you to check provided "data" and make sure all id are unique';
export const USE_CHART_DATA_REMAP_ERR_UNIQUE_ORDER_TEXT =
  'Items with equal "order" params will be sorted one by another.';

type TUseChartDataRemap = {
  data: TPieDonutChartPropsInternal['data'];
  gap: TPieDonutChartPropsInternal['gap'];
};

/**
 * 1. checks if some fields in data items are undefined
 * 2. sorts data items
 * 3. add gaps if it's needed
 *
 * @function useChartDataRemap (hook)
 * @param { TUseChartDataRemap } props
 * @return { TDataItemRequired[] } returns "re-mapped" sorted data (with all necessary params) and fake "gap" segments (if it's needed)
 */
export const useChartDataRemap = (props: TUseChartDataRemap): TDataItemRequired[] => {
  const { data: dataProp, gap } = props;

  const incomingData = useMemo(() => {
    /**
     * Filter to only segments with a finite positive value:
     * - value: 0   → excluded (can't draw a zero-size arc; intentional)
     * - value < 0  → excluded (nonsensical in a pie/donut context; warns)
     * - value: Infinity / -Infinity → excluded (would produce NaN coords; warns)
     * - value: NaN → excluded (already falsy, but handled explicitly below)
     *
     * Note: `!!0 === false` so zero is already excluded by the `!!segment.value` check;
     * negatives and Infinity both pass `!!`, so we need explicit guards for them.
     */
    const dataValid = dataProp.filter((segment) => {
      if (!segment.value) {
        return false;
      }

      if (!isFinite(segment.value) || segment.value < 0) {
        consoleWarn(`
          Data item param "value" error: Must be a finite positive number.
          
          Provided: "value" = ${segment.value}
          This item will be excluded from the chart.
          `);
        return false;
      }

      return true;
    });

    if (!dataValid.length) {
      return [];
    }

    return dataValid
      .map((item, i) => {
        let id = item.id;
        if (id && dataValid.filter((dataItem) => dataItem.id === id).length > 1) {
          const newId = generateUniqueID();

          consoleWarn(`
          Data item #${i} param "id" error: Must be unique.
          
          Provided: "id" = ${id}
          This was caught and now one of equals "id" replaced with: "id" = ${newId}
          ${USE_CHART_DATA_REMAP_ERR_UNIQUE_ID_TEXT}
          `);

          id = newId;
        }

        let order = item.order;

        if (typeof order === 'number' && dataValid.filter((dataItem) => dataItem.order === order).length > 1) {
          consoleWarn(`
          Data item #${i} param "order" error: Should be unique.
          
          Provided: "order" = ${order}
          ${USE_CHART_DATA_REMAP_ERR_UNIQUE_ORDER_TEXT}
          Just make sure the result on the chart is what you expected.
          `);
        }

        order = 0;

        if (dataValid.length > 1) {
          /**
           * Use nullish coalescing (??) rather than logical OR (||) so that
           * order: 0 is preserved. With ||, `0 || fallback` would always pick
           * the fallback, treating 0 as "no order provided" — a bug that caused
           * items with order:0 to be sorted after all explicitly-ordered items.
           */
          order = item.order ?? dataValid.length + 1 + i;
        }

        return {
          color: item.color || randomColorHEX(),
          id: id || generateUniqueID(),
          order,
          value: item.value
        };
      })
      .sort((a, b) => {
        if (a.order < b.order) {
          return -1;
        }
        if (a.order > b.order) {
          return 1;
        }
        return 0;
      }) as TDataItemRequired[];
  }, [dataProp]);

  return useMemo(() => {
    if (!gap) {
      return incomingData;
    }

    const segments: TDataItemRequired[] = [];

    if (gap) {
      const arrLength = incomingData.length > 1 ? incomingData.length * 2 : 1;

      Array(arrLength)
        .fill(null)
        .forEach((_, i) => {
          if (i === 0) {
            segments.push({
              ...incomingData[0],
              order: 0
            });
            return;
          }

          if (i % 2 !== 0) {
            segments.push({
              color: 'transparent',
              id: generateUniqueID(),
              order: i,
              value: gap
            });

            return;
          }

          segments.push({
            ...incomingData[i / 2],
            order: i
          });
        });
    }

    return segments;
  }, [gap, incomingData]);
};
