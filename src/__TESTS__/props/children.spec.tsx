import React from 'react';

import { render } from '@testing-library/react';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_PROPS,
} from 'tests/mocks/variables';

describe('prop "children"', () => {
  it('generates its content (JSX, string, number) inside the appropriate container ("foreignObject" container)', () => {
    expect.assertions(3);

    const TEST_ID_CHART_CHILDREN = 'TEST_ID_CHART_CHILDREN';

    const {
      getByTestId,
      getByText,
      rerender,
    } = render((
      <PieDonutChart {...TEST_CHART_PROPS_COMMON}>
        <div data-testid={TEST_ID_CHART_CHILDREN} />
      </PieDonutChart>
    ));

    expect(getByTestId(TEST_ID_CHART_CHILDREN)).toBeInTheDocument();

    const text = TEST_PROPS.text;

    rerender((
      <PieDonutChart {...TEST_CHART_PROPS_COMMON}>
        {text}
      </PieDonutChart>
    ));

    expect(getByText(text)).toBeInTheDocument();

    const num = 123;

    rerender((
      <PieDonutChart {...TEST_CHART_PROPS_COMMON}>
        {num}
      </PieDonutChart>
    ));

    expect(getByText(num)).toBeInTheDocument();
  });
});
