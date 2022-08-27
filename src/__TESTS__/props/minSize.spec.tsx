import React from 'react';

import {
  render,
  waitFor,
} from '@testing-library/react';
import {
  PieDonutChart,
  TEST_DATA_ID_CHART_SVG_MAIN,
} from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_PROPS,
} from 'tests/mocks/variables';

describe('prop "minSize"', () => {
  it('sets the minimum chart size by the provided "minSize" prop', async () => {
    expect.hasAssertions();

    const minSize = TEST_PROPS.minSize;

    const { getByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        minSize={minSize}
      />
    ));

    await waitFor(() => {
      expect(getByTestId(TEST_DATA_ID_CHART_SVG_MAIN))
        .toHaveAttribute('viewBox', `0 0 ${minSize} ${minSize}`);
    });
  });
});
