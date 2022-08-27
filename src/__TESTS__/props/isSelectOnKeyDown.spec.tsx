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


describe('prop "isSelectOnKeyEnterDown"', () => {
  it('disables segment selection on "enter" key press on it', () => {
    expect.assertions(2);

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        isSelectOnKeyEnterDown={false}
      />
    ));

    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    const { segmentOffset } = getSegmentParams({
      isFirst: true,
      segment,
    });

    expect(segment).toHaveStyle(`transform: rotate(${segmentOffset}deg) scale(1)`);
    fireEvent.keyDown(segment, {
      code: 13,
      key: 'Enter',
    });
    expect(segment).toHaveStyle(`transform: rotate(${segmentOffset}deg) scale(1)`);
  });

  it('enables segment selection on "enter" key press on it', () => {
    expect.assertions(2);

    const { getAllByTestId } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        isSelectOnKeyEnterDown
      />
    ));

    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    const { segmentOffset } = getSegmentParams({
      isFirst: true,
      segment,
    });

    expect(segment).toHaveStyle(`transform: rotate(${segmentOffset}deg) scale(1)`);
    fireEvent.keyDown(segment, {
      code: 13,
      key: 'Enter',
    });
    expect(segment).toHaveStyle(`transform: rotate(${segmentOffset}deg) scale(${DEFAULT_CHART_SEGMENT_SCALE_RATIO})`);
  });
});
