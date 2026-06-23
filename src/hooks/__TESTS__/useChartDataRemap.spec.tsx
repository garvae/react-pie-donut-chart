import { renderHook } from '@testing-library/react';
import {
  USE_CHART_DATA_REMAP_ERR_UNIQUE_ID_TEXT,
  USE_CHART_DATA_REMAP_ERR_UNIQUE_ORDER_TEXT,
  useChartDataRemap
} from 'hooks/useChartDataRemap';
import { mockConsole } from 'tests/mocks/console';
import { TEST_PROPS } from 'tests/mocks/variables';
import { multilineToSingleLineLowerCased } from 'tests/utils/multilineToSingleLine';
import { DataItem } from 'types';

const USE_CHART_DATA_REMAP_TEST_PROPS_DATA_COMPLETE_SORTED: Required<DataItem>[] = [
  ...TEST_PROPS.data.slice(0, 3),
  TEST_PROPS.data[4],
  TEST_PROPS.data[3]
] as Required<DataItem>[];

describe('hook "useChartDataRemap"', () => {
  it('returns the same valid sorted "data" when prop "data" contains complete elements', () => {
    expect.assertions(2);

    const { consoleErrorMocked } = mockConsole();

    const { result } = renderHook(() =>
      useChartDataRemap({
        data: USE_CHART_DATA_REMAP_TEST_PROPS_DATA_COMPLETE_SORTED,
        gap: 0
      })
    );

    expect(result.current).toStrictEqual(USE_CHART_DATA_REMAP_TEST_PROPS_DATA_COMPLETE_SORTED);
    expect(consoleErrorMocked).not.toHaveBeenCalled();
  });

  it('returns the same valid sorted "data" when prop "data" contains incomplete elements', () => {
    expect.assertions(2);

    const { consoleErrorMocked } = mockConsole();

    const { result } = renderHook(() =>
      useChartDataRemap({
        data: [{ value: 50 }, ...(TEST_PROPS.data.slice(0, TEST_PROPS.data.length - 1) as Required<DataItem>[])],
        gap: 0
      })
    );

    expect(result.current).toHaveLength(USE_CHART_DATA_REMAP_TEST_PROPS_DATA_COMPLETE_SORTED.length);
    expect(consoleErrorMocked).not.toHaveBeenCalled();
  });

  it('shows error when 2 "data" items with same "id" are provided', () => {
    expect.assertions(1);

    const { consoleWarnMocked } = mockConsole();

    renderHook(() =>
      useChartDataRemap({
        data: [
          {
            ...TEST_PROPS.data[0],
            order: 6
          },
          ...TEST_PROPS.data
        ],
        gap: 0
      })
    );

    const consoleCallText = consoleWarnMocked.mock.calls[0][0];

    expect(multilineToSingleLineLowerCased(consoleCallText)).toContain(
      multilineToSingleLineLowerCased(USE_CHART_DATA_REMAP_ERR_UNIQUE_ID_TEXT)
    );
  });

  it('shows error when 2 "data" items with same "order" are provided', () => {
    expect.assertions(1);

    const { consoleWarnMocked } = mockConsole();

    renderHook(() =>
      useChartDataRemap({
        data: [
          {
            ...TEST_PROPS.data[0],
            id: '006'
          },
          ...TEST_PROPS.data
        ],
        gap: 0
      })
    );

    const consoleCallText = consoleWarnMocked.mock.calls[0][0];

    expect(multilineToSingleLineLowerCased(consoleCallText)).toContain(
      multilineToSingleLineLowerCased(USE_CHART_DATA_REMAP_ERR_UNIQUE_ORDER_TEXT)
    );
  });

  it('returns the valid-length "data" when the prop "gap" was provided', () => {
    expect.assertions(1);

    const { result } = renderHook(() =>
      useChartDataRemap({
        data: USE_CHART_DATA_REMAP_TEST_PROPS_DATA_COMPLETE_SORTED,
        gap: TEST_PROPS.gap
      })
    );

    expect(result.current).toHaveLength(USE_CHART_DATA_REMAP_TEST_PROPS_DATA_COMPLETE_SORTED.length * 2);
  });

  it('preserves "order: 0" — zero order must not be treated as falsy/missing', () => {
    expect.assertions(2);

    const { result } = renderHook(() =>
      useChartDataRemap({
        data: [
          { color: '#ff0000', id: 'a', order: 0, value: 10 },
          { color: '#0000ff', id: 'b', order: 1, value: 20 }
        ],
        gap: 0
      })
    );

    /**
     * Item with order:0 must sort before item with order:1.
     * If "order: 0" were treated as falsy and replaced by a fallback,
     * the fallback would be > 1, so item 'a' would appear LAST instead of FIRST.
     */
    expect(result.current[0].id).toBe('a');
    expect(result.current[1].id).toBe('b');
  });

  it('filters out data items with negative "value" and warns via consoleWarn', () => {
    expect.assertions(2);

    const { consoleWarnMocked } = mockConsole();

    const { result } = renderHook(() =>
      useChartDataRemap({
        data: [
          { color: '#ff0000', id: 'a', order: 1, value: -10 },
          { color: '#0000ff', id: 'b', order: 2, value: 20 }
        ],
        gap: 0
      })
    );

    // Only the valid item should survive
    expect(result.current).toHaveLength(1);
    expect(consoleWarnMocked).toHaveBeenCalled();
  });

  it('filters out data items with Infinity "value" and warns via consoleWarn', () => {
    expect.assertions(2);

    const { consoleWarnMocked } = mockConsole();

    const { result } = renderHook(() =>
      useChartDataRemap({
        data: [
          { color: '#ff0000', id: 'a', order: 1, value: Infinity },
          { color: '#0000ff', id: 'b', order: 2, value: 20 }
        ],
        gap: 0
      })
    );

    expect(result.current).toHaveLength(1);
    expect(consoleWarnMocked).toHaveBeenCalled();
  });

  it('returns an empty array when all data items have invalid values', () => {
    expect.assertions(1);

    mockConsole();

    const { result } = renderHook(() =>
      useChartDataRemap({
        data: [
          { color: '#ff0000', id: 'a', order: 1, value: -5 },
          { color: '#0000ff', id: 'b', order: 2, value: 0 }
        ],
        gap: 0
      })
    );

    expect(result.current).toHaveLength(0);
  });
});
