import React from 'react';


import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TEST_DATA_ID_CHART_GROUP_SEGMENT } from 'components/Chart';
import { PieDonutChart } from 'components/PieDonutChart';
import { TEST_CHART_PROPS_COMMON } from 'tests/mocks/variables';

describe('prop "tabIndex"', () => {
  it('enables chart navigation with a "tab"', () => {
    expect.hasAssertions();
    const assertions = TEST_CHART_PROPS_COMMON.data.length;
    expect.assertions(assertions);

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        tabIndex={0}
      />
    ));

    const segments = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT);
    const segment = segments[0];
    const otherSegments = segments.slice(1);

    userEvent.tab();
    expect(segment).toHaveFocus();
    otherSegments.forEach(item => expect(item).not.toHaveFocus());
  });

  it('disables chart navigation with a "tab"', () => {
    expect.hasAssertions();
    const assertions = TEST_CHART_PROPS_COMMON.data.length;
    expect.assertions(assertions);

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        tabIndex={-1}
      />
    ));

    const segments = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT);
    userEvent.tab();
    segments.forEach(item => expect(item).not.toHaveFocus());
  });
});
