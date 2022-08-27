import React from 'react';


import { render } from '@testing-library/react';
import { TEST_DATA_ID_CHART_SEGMENTS_BACKGROUND } from 'components/ChartSegmentsBackground';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_PROPS,
} from 'tests/mocks/variables';

describe('prop "colorSegmentsBackground"', () => {
  it('generates a segments background element filled with the provided color', () => {
    expect.assertions(1);

    const { segmentsBackground } = TEST_PROPS.colors;

    const { getByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        colors={{ segmentsBackground }}
      />
    ));

    expect(getByTestId(TEST_DATA_ID_CHART_SEGMENTS_BACKGROUND)).toHaveAttribute('stroke', segmentsBackground);
  });

  it('generates a segments background element filled with the provided color when "donutThickness" prop is provided', () => {
    expect.assertions(1);

    const { segmentsBackground } = TEST_PROPS.colors;

    const { getByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        colors={{ segmentsBackground }}
        donutThickness={TEST_PROPS.donutThickness}
      />
    ));

    expect(getByTestId(TEST_DATA_ID_CHART_SEGMENTS_BACKGROUND)).toHaveAttribute('stroke', segmentsBackground);
  });
});
