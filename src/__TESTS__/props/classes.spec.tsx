import React from 'react';

import { render } from '@testing-library/react';
import { PieDonutChart } from 'components/PieDonutChart';
import {
  TEST_CHART_PROPS_COMMON,
  TEST_CLASSNAMES,
  TEST_PROPS,
} from 'tests/mocks/variables';

describe('props [class~]', () => {
  it('sets corresponding classes for chart elements', () => {
    expect.hasAssertions();
    const assertionsNumber = Object.keys(TEST_CLASSNAMES).length;
    expect.assertions(assertionsNumber);

    const { container } = render((
      /**
       * Here we have to set all the [class] props + some other props to make sure all required elements are rendered.
       * Props:
       * + chartCenterSize
       * + children
       * + colors.chartBackground
       * + colors.segmentsBackground
       * + data
       * + size
       * + text
       */
      <PieDonutChart
        {...TEST_CHART_PROPS_COMMON}
        chartCenterSize={TEST_PROPS.chartCenterSize}
        className={TEST_PROPS.className}
        classNames={TEST_CLASSNAMES}
        colors={
          {
            chartBackground: TEST_PROPS.colors.chartBackground,
            segmentsBackground: TEST_PROPS.colors.segmentsBackground,
          }
        }
        text={TEST_PROPS.text}
      >
        <div />
      </PieDonutChart>
    ));

    const {
      chartSegment,
      ...restClassNames
    } = TEST_CLASSNAMES;

    Object.values(restClassNames).forEach(classNameValue =>
      expect(container.getElementsByClassName(classNameValue)).toHaveLength(1));

    expect(container.getElementsByClassName(chartSegment)).toHaveLength(TEST_PROPS.data.length);
  });
});
