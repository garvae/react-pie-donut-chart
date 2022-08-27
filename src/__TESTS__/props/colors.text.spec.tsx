import React from 'react';

import { render } from '@testing-library/react';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_PROPS,
} from 'tests/mocks/variables';
import { convertHexToRgb } from 'utils/color';

describe('prop "colors.text"', () => {
  it('sets the provided color for the chart text', async () => {
    expect.assertions(1);

    const { text: colorText } = TEST_PROPS.colors;
    const text = TEST_PROPS.text;

    const { getByText } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        colors={{ text: colorText }}
        text={text}
      />
    ));

    expect(getByText(text)).toHaveStyle(`color: ${convertHexToRgb(colorText)}`);
  });
});
