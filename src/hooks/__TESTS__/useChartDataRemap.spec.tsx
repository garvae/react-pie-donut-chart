
import { DataItem } from 'types';

import { renderHook } from '@testing-library/react';
import {
  useChartDataRemap,
  USE_CHART_DATA_REMAP_ERR_UNIQUE_ID_TEXT,
  USE_CHART_DATA_REMAP_ERR_UNIQUE_ORDER_TEXT,
} from 'hooks/useChartDataRemap';
import { mockConsole } from 'tests/mocks/console';
import { TEST_PROPS } from 'tests/mocks/variables';
import { multilineToSingleLineLowerCased } from 'tests/utils/multilineToSingleLine';

const USE_CHART_DATA_REMAP_TEST_PROPS_DATA_COMPLETE_SORTED: Required<DataItem>[] = [
  ...TEST_PROPS.data.slice(0, 3),
  TEST_PROPS.data[4],
  TEST_PROPS.data[3],
] as Required<DataItem>[];

describe('hook "useChartDataRemap"', () => {
  it('returns the same valid sorted "data" when prop "data" contains complete elements', () => {
    expect.assertions(2);

    const { consoleErrorMocked } = mockConsole();

    const { result } = renderHook(() => useChartDataRemap({
      data: USE_CHART_DATA_REMAP_TEST_PROPS_DATA_COMPLETE_SORTED,
      gap: 0,
    }));

    expect(result.current).toStrictEqual(USE_CHART_DATA_REMAP_TEST_PROPS_DATA_COMPLETE_SORTED);
    expect(consoleErrorMocked).not.toHaveBeenCalled();
  });

  it('returns the same valid sorted "data" when prop "data" contains incomplete elements', () => {
    expect.assertions(2);

    const { consoleErrorMocked } = mockConsole();

    const { result } = renderHook(() => useChartDataRemap({
      data: [ { value: 50 }, ...(TEST_PROPS.data.slice(0, TEST_PROPS.data.length - 1) as Required<DataItem>[]) ],
      gap: 0,
    }));

    expect(result.current).toHaveLength(USE_CHART_DATA_REMAP_TEST_PROPS_DATA_COMPLETE_SORTED.length);
    expect(consoleErrorMocked).not.toHaveBeenCalled();
  });

  it('shows error when 2 "data" items with same "id" are provided', () => {
    expect.assertions(1);

    const { consoleWarnMocked } = mockConsole();

    renderHook(() => useChartDataRemap({
      data: [ {
        ...TEST_PROPS.data[0],
        order: 6,
      }, ...TEST_PROPS.data ],
      gap: 0,
    }));

    const consoleCallText = consoleWarnMocked.mock.calls[0][0];

    expect(multilineToSingleLineLowerCased(consoleCallText))
      .toContain(multilineToSingleLineLowerCased(USE_CHART_DATA_REMAP_ERR_UNIQUE_ID_TEXT));
  });

  it('shows error when 2 "data" items with same "order" are provided', () => {
    expect.assertions(1);

    const { consoleWarnMocked } = mockConsole();

    renderHook(() => useChartDataRemap({
      data: [ {
        ...TEST_PROPS.data[0],
        id: '006',
      }, ...TEST_PROPS.data ],
      gap: 0,
    }));

    const consoleCallText = consoleWarnMocked.mock.calls[0][0];

    expect(multilineToSingleLineLowerCased(consoleCallText))
      .toContain(multilineToSingleLineLowerCased(USE_CHART_DATA_REMAP_ERR_UNIQUE_ORDER_TEXT));
  });

  it('returns the valid-length "data" when the prop "gap" was provided', () => {
    expect.assertions(1);

    const { result } = renderHook(() => useChartDataRemap({
      data: USE_CHART_DATA_REMAP_TEST_PROPS_DATA_COMPLETE_SORTED,
      gap: TEST_PROPS.gap,
    }));

    expect(result.current).toHaveLength(USE_CHART_DATA_REMAP_TEST_PROPS_DATA_COMPLETE_SORTED.length * 2);
  });
});
