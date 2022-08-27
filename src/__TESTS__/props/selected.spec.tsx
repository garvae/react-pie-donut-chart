import React from 'react';


import { render } from '@testing-library/react';
import {
  TEST_DATA_ID_CHART_GROUP_SEGMENT,
  TEST_DATA_ATTR_CHART_GROUP_SEGMENT_ID,
  TEST_DATA_ATTR_CHART_GROUP_SEGMENT_SELECTED,
} from 'components/Chart';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_PROPS,
} from 'tests/mocks/variables';

describe('prop "selected"', () => {
  it('sets the selected segment', () => {
    expect.assertions(1);

    const selected = TEST_PROPS.selected;

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        selected={selected}
      />
    ));

    const segments = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT);
    const segment = segments.find(item => selected === item.getAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_ID));

    expect(segment).toHaveAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_SELECTED, 'true');
  });
});
