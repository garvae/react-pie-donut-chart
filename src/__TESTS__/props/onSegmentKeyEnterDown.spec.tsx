import React from 'react';


import {
  render,
  fireEvent,
} from '@testing-library/react';
import { TEST_DATA_ID_CHART_GROUP_SEGMENT } from 'components/Chart';
import { PieDonutChart } from 'components/PieDonutChart';
import { TEST_CHART_PROPS_COMMON } from 'tests/mocks/variables';
import { getSegmentParams } from 'tests/utils/get-segment-params';

describe('prop "onSegmentKeyEnterDown"', () => {
  it('provides a callback to the segment\'s "onKeyDown" handler', () => {
    expect.assertions(1);

    const onSegmentKeyEnterDown = jest.fn();

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        onSegmentKeyEnterDown={onSegmentKeyEnterDown}
      />
    ));

    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    const { segmentId } = getSegmentParams({
      isFirst: true,
      segment,
    });

    fireEvent.keyDown(segment, {
      code: 13,
      key: 'Enter',
    });
    expect(onSegmentKeyEnterDown).toHaveBeenCalledWith(segmentId);
  });
});
