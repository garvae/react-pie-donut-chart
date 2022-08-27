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

describe('prop "maxSize"', () => {
  it('sets the maximum chart size by the provided "maxSize" prop', async () => {
    expect.hasAssertions();

    const maxSize = TEST_PROPS.maxSize;

    const { getByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        maxSize={maxSize}
      />
    ));

    await waitFor(() => {
      expect(getByTestId(TEST_DATA_ID_CHART_SVG_MAIN))
        .toHaveAttribute('viewBox', `0 0 ${maxSize} ${maxSize}`);
    });
  });
});
