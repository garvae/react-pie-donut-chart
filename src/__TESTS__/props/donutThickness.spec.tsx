import React from 'react';


import { render } from '@testing-library/react';
import {
  TEST_DATA_ID_CHART_GROUP_SEGMENT,
  TEST_DATA_ATTR_CHART_GROUP_SEGMENT_THICKNESS,
} from 'components/Chart';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_PROPS,
} from 'tests/mocks/variables';

describe('prop "donutThickness"', () => {
  it('generates a "donut" type chart', () => {
    expect.hasAssertions();
    const assertionsNumber = TEST_CHART_PROPS_COMMON.data.length;
    expect.assertions(assertionsNumber);

    const donutThickness = TEST_PROPS.donutThickness;

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        donutThickness={donutThickness}
      />
    ));

    getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)
      .forEach(item => expect(item).toHaveAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_THICKNESS, String(donutThickness)));
  });
});
