import { mockConsole } from 'tests/mocks/console';
import {
  CHECK_INCOMING_VALUES_TEST_VALUES_VALID,
  CHECK_INCOMING_VALUES_TEST_VALUES_INVALID,
  TEST_CHART_SEGMENT_PATH_DRAW,
} from 'tests/mocks/variables';
import { createChartSegmentPathDraw } from 'utils/createChartSegmentPathDraw/createChartSegmentPathDraw';

describe('function "createChartSegmentPathDraw"', () => {
  it('returns a valid path draw when provided props are valid', () => {
    expect.assertions(2);
    const { consoleErrorMocked } = mockConsole();

    const path = createChartSegmentPathDraw(CHECK_INCOMING_VALUES_TEST_VALUES_VALID);

    expect(path).toBe(TEST_CHART_SEGMENT_PATH_DRAW);
    expect(consoleErrorMocked).not.toHaveBeenCalled();
  });

  it('returns a valid fallback when provided props are invalid', () => {
    expect.assertions(2);
    const { consoleErrorMocked } = mockConsole();

    const path = createChartSegmentPathDraw(CHECK_INCOMING_VALUES_TEST_VALUES_INVALID);

    expect(path).toBe('');
    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });
});
