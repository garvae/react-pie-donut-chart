import { useMemo } from 'react';

import {
  TDataItemRequired,
  TPieDonutChartPropsInternal,
} from 'types/PieDonutChart.types.internal';
import { randomColorHEX } from 'utils/color';
import { consoleWarn } from 'utils/console';
import { generateUniqueID } from 'utils/id';

export const USE_CHART_DATA_REMAP_ERR_UNIQUE_ID_TEXT = 'It recommended to you to check provided "data" and make sure all id are unique';
export const USE_CHART_DATA_REMAP_ERR_UNIQUE_ORDER_TEXT = 'Items with equal "order" params will be sorted one by another.';

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

  const {
    data: dataProp,
    gap,
  } = props;

  const incomingData = useMemo(() => dataProp
    .map((item, i) => {

      let id = item.id;
      if (id && dataProp.filter(dataItem => dataItem.id === id).length > 1) {
        const newId = generateUniqueID();

        consoleWarn(`
        Data item #${i} param "id" error: Must be unique.
        
        Provided: "id" = ${id}
        This was caught and now one of equals "id" replaced with: "id" = ${newId}
        ${USE_CHART_DATA_REMAP_ERR_UNIQUE_ID_TEXT}
        `);

        id = newId;
      }

      const order = item.order;
      if (typeof order === 'number' && dataProp.filter(dataItem => dataItem.order === order).length > 1) {
        consoleWarn(`
        Data item #${i} param "order" error: Should be unique.
        
        Provided: "order" = ${order}
        ${USE_CHART_DATA_REMAP_ERR_UNIQUE_ORDER_TEXT}
        Just make sure the result on the chart is what you expected.
        `);
      }

      return {
        color: item.color || randomColorHEX(),
        id: id || generateUniqueID(),
        order: item.order || dataProp.length + 1 + i,
        value: item.value,
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
    }) as TDataItemRequired[], [ dataProp ]);

  return useMemo(() => {
    if (!gap) {
      return incomingData;
    }

    const segments: TDataItemRequired[] = [];

    if (gap) {
      Array(incomingData.length * 2)
        .fill(null)
        .forEach((_, i) => {

          if (i === 0) {
            segments.push({
              ...incomingData[0],
              order: 0,
            });
            return;
          }

          if (i % 2 !== 0) {
            segments.push({
              color: 'transparent',
              id: generateUniqueID(),
              order: i,
              value: gap,
            });

            return;
          }

          segments.push({
            ...incomingData[i / 2],
            order: i,
          });
        });
    }

    return segments;
  }, [ gap, incomingData ]);

};
