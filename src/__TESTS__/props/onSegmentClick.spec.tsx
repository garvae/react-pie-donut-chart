import React from 'react';


import {
  render,
  fireEvent,
} from '@testing-library/react';
import { TEST_DATA_ID_CHART_GROUP_SEGMENT } from 'components/Chart';
import { PieDonutChart } from 'components/PieDonutChart';
import { TEST_CHART_PROPS_COMMON } from 'tests/mocks/variables';
import { getSegmentParams } from 'tests/utils/get-segment-params';

describe('prop "onSegmentClick"', () => {
  it('provides a callback to the segment\'s "onClick" handler', () => {
    expect.assertions(1);

    const onSegmentClick = jest.fn();

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        onSegmentClick={onSegmentClick}
      />
    ));

    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    const { segmentId } = getSegmentParams({
      isFirst: true,
      segment,
    });

    fireEvent.click(segment);
    expect(onSegmentClick).toHaveBeenCalledWith(segmentId);
  });
});
