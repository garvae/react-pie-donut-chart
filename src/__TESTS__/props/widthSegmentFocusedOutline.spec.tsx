import React from 'react';


import {
  render,
  waitFor,
} from '@testing-library/react';
import { TEST_DATA_ID_CHART_GROUP_SEGMENT } from 'components/Chart';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_PROPS,
} from 'tests/mocks/variables';
import { DEFAULT_FOCUSED_SEGMENT_STROKE_WIDTH_TO_SIZE_RATIO } from 'variables/defaults';

describe('prop "widthSegmentFocusedOutline"', () => {
  it('sets the provided width for the stroke of the focused segment', () => {
    expect.assertions(1);

    const widthSegmentFocusedOutline = TEST_PROPS.widthSegmentFocusedOutline;

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        widthSegmentFocusedOutline={widthSegmentFocusedOutline}
      />
    ));

    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    expect(segment).toHaveAttribute('stroke-width', String(widthSegmentFocusedOutline));
  });

  it('sets the default stroke width of the focused segment if "widthSegmentFocusedOutline" is not provided', async () => {
    expect.hasAssertions();

    const { getAllByTestId } = render(<PieDonutChart {...TEST_CHART_PROPS_COMMON} />);

    const defaultStrokeWidth = TEST_PROPS.size * DEFAULT_FOCUSED_SEGMENT_STROKE_WIDTH_TO_SIZE_RATIO;

    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    await waitFor(() => {
      expect(segment).toHaveAttribute('stroke-width', String(defaultStrokeWidth));
    });
  });
});
