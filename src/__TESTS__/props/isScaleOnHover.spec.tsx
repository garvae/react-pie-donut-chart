import React from 'react';


import {
  render,
  fireEvent,
} from '@testing-library/react';
import { TEST_DATA_ID_CHART_GROUP_SEGMENT } from 'components/Chart';
import { PieDonutChart } from 'components/PieDonutChart';
import { TEST_CHART_PROPS_COMMON } from 'tests/mocks/variables';
import { getSegmentParams } from 'tests/utils/get-segment-params';
import { DEFAULT_CHART_SEGMENT_SCALE_RATIO } from 'variables/defaults';


describe('prop "isScaleOnHover"', () => {
  it('disables scale on hover', () => {
    expect.assertions(2);

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        isScaleOnHover={false}
      />
    ));

    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    const { segmentOffset } = getSegmentParams({
      isFirst: true,
      segment,
    });

    expect(segment).toHaveStyle(`transform: rotate(${segmentOffset}deg) scale(1)`);
    fireEvent.mouseOver(segment);
    expect(segment).toHaveStyle(`transform: rotate(${segmentOffset}deg) scale(1)`);
  });

  it('enables scale on hover', () => {
    expect.assertions(2);

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        isScaleOnHover
      />
    ));

    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    const { segmentOffset } = getSegmentParams({
      isFirst: true,
      segment,
    });

    expect(segment).toHaveStyle(`transform: rotate(${segmentOffset}deg) scale(1)`);
    fireEvent.mouseOver(segment);
    expect(segment).toHaveStyle(`transform: rotate(${segmentOffset}deg) scale(${DEFAULT_CHART_SEGMENT_SCALE_RATIO})`);
  });
});
