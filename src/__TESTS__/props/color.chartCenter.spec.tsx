import React from 'react';


import { render } from '@testing-library/react';
import { TEST_DATA_ID_CHART_CENTER } from 'components/ChartCenter';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_PROPS,
} from 'tests/mocks/variables';

describe('prop "colors.chartCenter"', () => {
  it('applies the provided color to the round center element of the chart', () => {
    expect.assertions(1);

    const { chartCenter } = TEST_PROPS.colors;

    const { getByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        chartCenterSize={TEST_PROPS.chartCenterSize}
        colors={{ chartCenter }}
      />
    ));

    expect(getByTestId(TEST_DATA_ID_CHART_CENTER)).toHaveAttribute('fill', chartCenter);
  });
});
