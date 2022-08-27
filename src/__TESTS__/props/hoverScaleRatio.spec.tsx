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
import { getSegmentParams } from 'tests/utils/get-segment-params';


describe('prop "hoverScaleRatio"', () => {
  it('sets the provided scale when some segment is hovered', () => {
    expect.assertions(2);

    const hoverScaleRatio = TEST_PROPS.hoverScaleRatio;

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        hoverScaleRatio={hoverScaleRatio}
      />
    ));

    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    const { segmentOffset } = getSegmentParams({
      isFirst: true,
      segment,
    });

    expect(segment).toHaveStyle(`transform: rotate(${segmentOffset}deg) scale(1)`);
    fireEvent.mouseOver(segment);
    expect(segment).toHaveStyle(`transform: rotate(${segmentOffset}deg) scale(${hoverScaleRatio})`);
  });
});
