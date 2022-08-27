import React from 'react';


import { render } from '@testing-library/react';
import {
  TEST_DATA_ID_CHART_GROUP_SEGMENT,
  TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP,
} from 'components/Chart';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_DATA,
  TEST_PROPS,
} from 'tests/mocks/variables';


describe('prop "gap"', () => {
  it('generates number of "gap" chart segments equals to the "data" length and "gap" value equals to provided', () => {
    expect.assertions(1);

    const gap = TEST_PROPS.gap;

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        gap={gap}
      />
    ));

    const gapSegments = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)
      .filter(item => item.getAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP) === String(gap));

    expect(gapSegments).toHaveLength(TEST_DATA.length);
  });
});
