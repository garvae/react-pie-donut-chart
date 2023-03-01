import React from 'react';

import { render } from '@testing-library/react';
import { PieDonutChart } from 'components/PieDonutChart';
import { mockConsole } from 'tests/mocks/console';
import {
  TEST_CHART_PROPS_COMMON,
  FAKE_DATA_SLICED,
  TEST_SIZE_CHART,
  TEST_PROPS,
  FAKE_DATA_SINGLE_SEGMENT,
  FAKE_DATA_ONLY_ONE_VALID_SEGMENT,
} from 'tests/mocks/variables';
import { multilineToSingleLineLowerCased } from 'tests/utils/multilineToSingleLine';
import { INVALID_DATA_DEFAULT_ERROR } from 'utils/checkPropsErrors';

describe('prop "data"', () => {
  it('generates a segment when only one element in the "data" array', () => {
    expect.assertions(2);

    const {
      container,
      rerender,
    } = render(<PieDonutChart {...TEST_CHART_PROPS_COMMON} />);

    expect(container.querySelectorAll('path')).toHaveLength(TEST_PROPS.data.length);

    rerender((
      <PieDonutChart
        data={FAKE_DATA_SINGLE_SEGMENT}
        size={TEST_SIZE_CHART}
      />
    ));

    expect(container.querySelectorAll('path')).toHaveLength(FAKE_DATA_SINGLE_SEGMENT.length);
  });

  it('generates a number of segments equal to the number of elements of the "data" array', () => {
    expect.assertions(2);

    const {
      container,
      rerender,
    } = render(<PieDonutChart {...TEST_CHART_PROPS_COMMON} />);

    expect(container.querySelectorAll('path')).toHaveLength(TEST_PROPS.data.length);

    rerender((
      <PieDonutChart
        data={FAKE_DATA_SLICED}
        size={TEST_SIZE_CHART}
      />
    ));

    expect(container.querySelectorAll('path')).toHaveLength(FAKE_DATA_SLICED.length);
  });

  it('generates a chart when only one element in the "data" array have value > 0', () => {
    expect.assertions(1);

    const { container } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        data={FAKE_DATA_ONLY_ONE_VALID_SEGMENT}
      />
    ));

    expect(container.querySelectorAll('path')).toHaveLength(1);
  });

  it('shows an error when the provided required prop "data" is invalid', () => {
    expect.assertions(2);
    const { consoleErrorMocked }  = mockConsole();

    const { container } = render((
      <PieDonutChart
        // @ts-ignore
        data={undefined}
        size={TEST_SIZE_CHART}
      />
    ));

    expect(container.querySelector('svg')).toBeEmptyDOMElement();

    const consoleCallText = consoleErrorMocked.mock.calls[0][0];

    expect(multilineToSingleLineLowerCased(consoleCallText))
      .toContain(multilineToSingleLineLowerCased(INVALID_DATA_DEFAULT_ERROR));
  });
});
