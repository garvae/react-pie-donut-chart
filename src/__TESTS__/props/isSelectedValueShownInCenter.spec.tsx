import React from 'react';


import {
  render,
  fireEvent,
} from '@testing-library/react';
import { TEST_DATA_ID_CHART_GROUP_SEGMENT } from 'components/Chart';
import { TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT } from 'components/ChartText';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_PROPS,
} from 'tests/mocks/variables';
import { getElementFirstChildrenInnerHtml } from 'tests/utils/get-element-first-children-inner-html';
import { getSegmentParams } from 'tests/utils/get-segment-params';

describe('prop "isSelectedValueShownInCenter"', () => {
  it('disables the display of the value of the selected segment in the center of the chart', () => {
    expect.assertions(2);

    const {
      getAllByTestId,
      getByTestId,
    } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        donutThickness={TEST_PROPS.donutThickness}
        isSelectedValueShownInCenter={false}
      />
    ));

    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    const { totalDataValue } = getSegmentParams({
      isFirst: true,
      segment,
    });

    const textForeignObject = getByTestId(TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT);
    const checkIfRenderedTotal = () => getElementFirstChildrenInnerHtml({ element: textForeignObject }) === String(totalDataValue);

    expect(checkIfRenderedTotal()).toBeTruthy();
    fireEvent.click(segment);
    expect(checkIfRenderedTotal()).toBeTruthy();
  });

  it('enables to display the selected value of the segment in the center of the chart', () => {
    expect.assertions(2);

    const {
      getAllByTestId,
      getByTestId,
    } = render((
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        donutThickness={TEST_PROPS.donutThickness}
        isSelectedValueShownInCenter
      />
    ));

    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    const {
      segmentValue,
      totalDataValue,
    } = getSegmentParams({
      isFirst: true,
      segment,
    });

    const textForeignObject = getByTestId(TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT);
    const checkIfRenderedTotal = () => getElementFirstChildrenInnerHtml({ element: textForeignObject }) === String(totalDataValue);
    const checkIfRenderedValue = () => getElementFirstChildrenInnerHtml({ element: textForeignObject }) === String(segmentValue);

    expect(checkIfRenderedTotal()).toBeTruthy();
    fireEvent.click(segment);
    expect(checkIfRenderedValue()).toBeTruthy();
  });
});
