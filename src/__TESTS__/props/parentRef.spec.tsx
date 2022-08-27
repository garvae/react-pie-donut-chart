import React from 'react';

import {
  render,
  waitFor,
} from '@testing-library/react';
import {
  PieDonutChart,
  TEST_DATA_ID_CHART_SVG_MAIN,
} from 'components/PieDonutChart';
import { containerRefMocked } from 'tests/mocks/container-ref';
import {
  TEST_SIZE_CHART,
  TEST_PROPS,
} from 'tests/mocks/variables';

describe('prop "parentRef"', () => {
  it('sets the size of the "parent element" for the chart and triggers a re-rendering of the chart when the size of the "parent element" changes', async () => {
    expect.hasAssertions();

    const size = TEST_SIZE_CHART;
    const anotherSize = TEST_SIZE_CHART * 0.75;

    const {
      getByTestId,
      rerender,
    } = render((
      <PieDonutChart
        data={TEST_PROPS.data}
        parentRef={containerRefMocked(size)}
      />
    ));

    await waitFor(() => {
      expect(getByTestId(TEST_DATA_ID_CHART_SVG_MAIN))
        .toHaveAttribute('viewBox', `0 0 ${size} ${size}`);
    });

    rerender((
      <PieDonutChart
        data={TEST_PROPS.data}
        parentRef={containerRefMocked(anotherSize)}
      />
    ));

    await waitFor(() => {
      expect(getByTestId(TEST_DATA_ID_CHART_SVG_MAIN))
        .toHaveAttribute('viewBox', `0 0 ${anotherSize} ${anotherSize}`);
    });
  });
});
