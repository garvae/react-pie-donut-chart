import React from 'react';

import { render } from '@testing-library/react';
import { PieDonutChart } from 'components/PieDonutChart';
import { mockConsole } from 'tests/mocks/console';
import {
  TEST_SIZE_CHART,
  TEST_DATA,
} from 'tests/mocks/variables';

describe('prop "resizeReRenderDebounceTime"', () => {
  it('renders chart and shows an error when specified prop "resizeReRenderDebounceTime" is invalid', () => {
    expect.assertions(2);
    const { consoleErrorMocked }  = mockConsole();

    const { container } = render((
      <PieDonutChart
        data={TEST_DATA}
        // @ts-ignore
        resizeReRenderDebounceTime={null}
        size={TEST_SIZE_CHART}
      />
    ));

    expect(container.querySelectorAll('path')).toHaveLength(TEST_DATA.length);
    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });
});
