import React from 'react';

import {
  render,
  waitFor,
} from '@testing-library/react';
import {
  PieDonutChart,
  TEST_DATA_ID_CHART_SVG_MAIN,
} from 'components/PieDonutChart';
import { TEST_CHART_PROPS_COMMON } from 'tests/mocks/variables';

describe('prop "size"', () => {
  it('sets the provided "size" to the chart "viewBox"', async () => {
    expect.hasAssertions();

    const size = TEST_CHART_PROPS_COMMON.size;

    const { getByTestId } = render(<PieDonutChart {...TEST_CHART_PROPS_COMMON} />);

    await waitFor(() => {
      expect(getByTestId(TEST_DATA_ID_CHART_SVG_MAIN))
        .toHaveAttribute('viewBox', `0 0 ${size} ${size}`);
    });
  });
});
