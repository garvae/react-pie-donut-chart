import React from 'react';


import {
  render,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  TEST_DATA_ID_CHART_GROUP_SEGMENT,
  TEST_DATA_ATTR_CHART_GROUP_SEGMENT_SELECTED,
} from 'components/Chart';
import { PieDonutChart } from 'components/PieDonutChart';
import { TEST_CHART_PROPS_COMMON } from 'tests/mocks/variables';

describe('user behaviour [segment interaction]', () => {
  it('selects a chart segment by clicking on it and deselects it by clicking outside', async () => {
    expect.assertions(3);

    const containerId = 'containerId';
    const {
      getAllByTestId,
      getByTestId,
    } = render((
      <div data-testid={containerId}>
        <PieDonutChart {...TEST_CHART_PROPS_COMMON} />
      </div>
    ));

    const container = getByTestId(containerId);
    const segment = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT)[0];

    expect(segment).toHaveAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_SELECTED, 'false');
    userEvent.click(segment, { bubbles: true });

    act(() => {
      jest.runAllTimers();
    });

    expect(segment).toHaveAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_SELECTED, 'true');

    userEvent.click(container, { bubbles: true });

    expect(segment).toHaveAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_SELECTED, 'false');
  });

  it('focus and blur a segment by pressing the "TAB" button', () => {
    expect.hasAssertions();
    const assertions = TEST_CHART_PROPS_COMMON.data.length * 2;
    expect.assertions(assertions);

    const { getAllByTestId } = render(<PieDonutChart {...TEST_CHART_PROPS_COMMON} />);

    const segments = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT);
    const segment1 = segments[0];
    const segment2 = segments[1];

    userEvent.tab();

    expect(segment1).toHaveFocus();
    segments.slice(1).forEach(item => expect(item).not.toHaveFocus());

    userEvent.tab();

    expect(segment2).toHaveFocus();
    [ segment1, ...segments.slice(2) ].forEach(item => expect(item).not.toHaveFocus());
  });

  it('blurs a segment by clicking outside of it', () => {
    expect.hasAssertions();
    const assertions = TEST_CHART_PROPS_COMMON.data.length * 2;
    expect.assertions(assertions);

    const containerId = 'containerId';
    const {
      getAllByTestId,
      getByTestId,
    } = render((
      <div data-testid={containerId}>
        <PieDonutChart {...TEST_CHART_PROPS_COMMON} />
      </div>
    ));

    const container = getByTestId(containerId);
    const segments = getAllByTestId(TEST_DATA_ID_CHART_GROUP_SEGMENT);
    const segment1 = segments[0];

    userEvent.tab();

    expect(segment1).toHaveFocus();
    segments.slice(1).forEach(item => expect(item).not.toHaveFocus());

    userEvent.click(container, { bubbles: true });

    act(() => {
      jest.runAllTimers();
    });

    segments.forEach(item => expect(item).not.toHaveFocus());
  });
});
