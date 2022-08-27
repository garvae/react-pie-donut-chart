import React from 'react';


import {
  render,
  waitFor,
} from '@testing-library/react';
import { TEST_DATA_ID_CHART_BACKGROUND } from 'components/ChartBackground';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_PROPS,
  TEST_SIZE_CHART_HALF_STR,
} from 'tests/mocks/variables';

describe('prop "colors.chartBackground"', () => {
  it('generates a "circle" chart background element with the provided color', async () => {
    expect.hasAssertions();

    const backgroundSize = TEST_SIZE_CHART_HALF_STR;
    const { chartBackground } = TEST_PROPS.colors;

    const { getByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        colors={{ chartBackground }}
      />
    ));

    await waitFor(() => {
      expect(getByTestId(TEST_DATA_ID_CHART_BACKGROUND)).toHaveAttribute('fill', chartBackground);
      expect(getByTestId(TEST_DATA_ID_CHART_BACKGROUND)).toHaveAttribute('cx', backgroundSize);
      expect(getByTestId(TEST_DATA_ID_CHART_BACKGROUND)).toHaveAttribute('cy', backgroundSize);
      expect(getByTestId(TEST_DATA_ID_CHART_BACKGROUND)).toHaveAttribute('r', backgroundSize);
    });
  });
});
