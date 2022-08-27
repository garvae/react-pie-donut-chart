import React from 'react';


import {
  render,
  waitFor,
} from '@testing-library/react';
import { TEST_DATA_ID_CHART_CENTER } from 'components/ChartCenter';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_SIZE_CHART_HALF,
  TEST_SIZE_CHART_HALF_STR,
} from 'tests/mocks/variables';

describe('prop "chartCenterSize"', () => {
  it('generates a round chart center element of provided size', async () => {
    expect.hasAssertions();

    const chartCenterSize = TEST_SIZE_CHART_HALF;
    const chartCenterSizeStr = TEST_SIZE_CHART_HALF_STR;

    const { getByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        chartCenterSize={chartCenterSize}
      />
    ));

    await waitFor(() => {
      expect(getByTestId(TEST_DATA_ID_CHART_CENTER)).toHaveAttribute('r', String(chartCenterSize / 2));
      expect(getByTestId(TEST_DATA_ID_CHART_CENTER)).toHaveAttribute('cx', chartCenterSizeStr);
      expect(getByTestId(TEST_DATA_ID_CHART_CENTER)).toHaveAttribute('cy', chartCenterSizeStr);
    });
  });
});
