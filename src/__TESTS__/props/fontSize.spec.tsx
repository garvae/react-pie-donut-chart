import React from 'react';

import {
  render,
  waitFor,
} from '@testing-library/react';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_PROPS,
} from 'tests/mocks/variables';
import { getCurrentFontSize } from 'utils/getCurrentFontSize';

describe('prop "fontSize"', () => {
  it('sets the provided "size" for the chart text', () => {
    expect.assertions(1);

    const text = TEST_PROPS.text;
    const fontSize = TEST_PROPS.fontSize;

    const { getByText } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        fontSize={fontSize}
        text={text}
      />
    ));

    expect(getByText(text)).toHaveStyle(`font-size: ${fontSize}px`);
  });

  it('sets the default value when no "fontSize" prop is provided', async () => {
    expect.hasAssertions();

    const text = TEST_PROPS.text;

    const { getByText } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        text={text}
      />
    ));

    const expectedFontSize = getCurrentFontSize({
      size: TEST_PROPS.size,
      text,
    });

    await waitFor(() => {
      expect(getByText(text)).toHaveStyle(`font-size: ${expectedFontSize}px`);
    });
  });
});
