import React from 'react';


import { render } from '@testing-library/react';
import { TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT } from 'components/ChartText';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_PROPS,
} from 'tests/mocks/variables';


describe('prop "text"', () => {
  it('renders the provided "text"', () => {
    expect.assertions(1);

    const text = TEST_PROPS.text;

    const { getByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        text={text}
      />
    ));

    expect(getByTestId(TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT).firstChild).toHaveTextContent(String(text));
  });

  it('renders the selected segment value when the \'text\' prop was not provided, but one of the segments is selected and the \'chartCenterSize\' prop is provided', () => {
    expect.assertions(1);

    const text = TEST_CHART_PROPS_COMMON.data[0].value;

    const { getByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        chartCenterSize={TEST_PROPS.chartCenterSize}
        selected={TEST_CHART_PROPS_COMMON.data[0].id}
      />
    ));

    expect(getByTestId(TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT).firstChild).toHaveTextContent(String(text));
  });

  it('renders the total value of "data" when the "text" prop was not provided and the "chartCenterSize" prop was provided', () => {
    expect.assertions(1);

    const text = TEST_CHART_PROPS_COMMON.data.reduce((current, next) => current + next.value, 0);

    const { getByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        chartCenterSize={TEST_PROPS.chartCenterSize}
      />
    ));

    expect(getByTestId(TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT).firstChild).toHaveTextContent(String(text));
  });

  it('renders the actual total value of \'data\' when the \'text\' prop was not provided, and the \'chartCenterSize\' and \'gap\' props are provided', () => {
    expect.assertions(1);

    const text = TEST_CHART_PROPS_COMMON.data.reduce((current, next) => current + next.value, 0);

    const { getByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        chartCenterSize={TEST_PROPS.chartCenterSize}
        gap={TEST_PROPS.gap}
      />
    ));

    expect(getByTestId(TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT).firstChild).toHaveTextContent(String(text));
  });
});
