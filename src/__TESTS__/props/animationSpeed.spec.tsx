import React from 'react';


import {
  render,
  waitFor,
} from '@testing-library/react';
import { TEST_DATA_ID_CHART_GROUP_SEGMENT } from 'components/Chart';
import { PieDonutChart } from 'components/PieDonutChart';
import { SAFETY_ANIMATION_DURATION_UPDATE_TIME } from 'hooks/useChartStates';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_PROPS,
} from 'tests/mocks/variables';

describe('prop "animationSpeed"', () => {
  it('is applied to segments', async () => {
    expect.hasAssertions();

    const animationSpeed = TEST_PROPS.animationSpeed;

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        animationSpeed={animationSpeed}
      />
    ));

    await waitFor(() => {
      getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)
        .forEach(item => expect(item).toHaveStyle(`transition-duration: ${animationSpeed}ms`));
    },
    { timeout: SAFETY_ANIMATION_DURATION_UPDATE_TIME * 2 /* At the moment I don't understand how this magic works */ });
  });
});
