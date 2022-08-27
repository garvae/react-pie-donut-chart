import React from 'react';


import {
  render,
  fireEvent,
} from '@testing-library/react';
import {
  TEST_DATA_ID_CHART_GROUP_SEGMENT,
  TEST_DATA_ATTR_CHART_GROUP_SEGMENT_ID,
} from 'components/Chart';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_PROPS,
} from 'tests/mocks/variables';


describe('prop "colors.segmentFocusedOutline"', () => {
  it('sets the provided color for the "outline" of the segment', () => {
    expect.assertions(1);

    const selectedSegmentId = TEST_PROPS.data[0].id;
    const { segmentFocusedOutline } = TEST_PROPS.colors;

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        colors={{ segmentFocusedOutline }}
        selected={selectedSegmentId}
      />
    ));

    const segmentToFocus = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)
      .find(item => item.getAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_ID) === selectedSegmentId);

    try {
      fireEvent.focus(segmentToFocus as HTMLElement);
    } catch {
      throw new Error('Segment not found');
    }

    expect(segmentToFocus).toHaveAttribute('stroke', segmentFocusedOutline);
  });
});
