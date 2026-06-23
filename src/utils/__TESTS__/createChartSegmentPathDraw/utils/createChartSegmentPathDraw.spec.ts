import { mockConsole } from 'tests/mocks/console';
import {
  CHECK_INCOMING_VALUES_TEST_VALUES_INVALID,
  CHECK_INCOMING_VALUES_TEST_VALUES_VALID,
  TEST_CHART_SEGMENT_PATH_DRAW
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

  it('returns a non-empty path without NaN when a single segment takes 100% (full circle)', () => {
    expect.assertions(2);
    mockConsole();

    /**
     * A single segment equals 100% of the chart:
     *   valueSegment / valueSegmentsTotal = 1 → angleDegrees = 360.
     * A naive SVG arc command for exactly 360° has the same start and end point,
     * which SVG spec defines as a degenerate arc (renders as nothing).
     * The function must clamp or split the arc so the path is both non-empty
     * and contains no "NaN" tokens.
     */
    const path = createChartSegmentPathDraw({
      ...CHECK_INCOMING_VALUES_TEST_VALUES_VALID,
      valueSegment: 1,
      valueSegmentsTotal: 1,
      valueSegmentsPreviousTotal: 0
    });

    expect(path).not.toBe('');
    expect(path).not.toContain('NaN');
  });
});
