import React from 'react';


import {
  render,
  fireEvent,
} from '@testing-library/react';
import { TEST_DATA_ID_CHART_GROUP_SEGMENT } from 'components/Chart';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_PROPS,
} from 'tests/mocks/variables';


describe('prop "stylesHoveredSegment"', () => {
  it('sets the provided styles for the hovered segment', () => {
    expect.assertions(2);

    const stylesHoveredSegment = TEST_PROPS.stylesHoveredSegment as React.CSSProperties;

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        stylesHoveredSegment={stylesHoveredSegment}
      />
    ));

    const stylesStr = Object.entries(stylesHoveredSegment).map(([ key, value ]) => `${key}: ${value}`)[0];
    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    expect(segment).not.toHaveStyle(stylesStr);
    fireEvent.mouseOver(segment);
    expect(segment).toHaveStyle(stylesStr);
  });
});
