import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DEFAULT_CHART_ARIA_LABEL, PieDonutChart, TEST_DATA_ID_CHART_SVG_MAIN } from 'components/PieDonutChart';
import React from 'react';
import { TEST_CHART_PROPS_COMMON } from 'tests/mocks/variables';

/**
 * Accessibility tests for the PieDonutChart component.
 * Covers WAI-ARIA roles, labels, keyboard interaction, and structure.
 */
describe('PieDonutChart — accessibility', () => {
  describe('SVG element', () => {
    it('has role="img" on the root <svg>', () => {
      expect.assertions(1);

      const { getByTestId } = render(<PieDonutChart {...TEST_CHART_PROPS_COMMON} />);

      expect(getByTestId(TEST_DATA_ID_CHART_SVG_MAIN)).toHaveAttribute('role', 'img');
    });

    it('has a default aria-label when no ariaLabel prop is provided', () => {
      expect.assertions(1);

      const { getByTestId } = render(<PieDonutChart {...TEST_CHART_PROPS_COMMON} />);

      expect(getByTestId(TEST_DATA_ID_CHART_SVG_MAIN)).toHaveAttribute('aria-label', DEFAULT_CHART_ARIA_LABEL);
    });

    it('uses the provided ariaLabel prop as aria-label', () => {
      expect.assertions(1);

      const customLabel = 'Sales breakdown chart';
      const { getByTestId } = render(<PieDonutChart {...TEST_CHART_PROPS_COMMON} ariaLabel={customLabel} />);

      expect(getByTestId(TEST_DATA_ID_CHART_SVG_MAIN)).toHaveAttribute('aria-label', customLabel);
    });
  });

  describe('segment elements', () => {
    it('interactive segments have role="button"', () => {
      expect.assertions(1);

      const { getAllByRole } = render(<PieDonutChart {...TEST_CHART_PROPS_COMMON} gap={0} />);

      const buttons = getAllByRole('button');

      expect(buttons.length).toBeGreaterThan(0);
    });

    it('interactive segments have a default aria-label when no getSegmentAriaLabel is provided', () => {
      const { getAllByRole } = render(<PieDonutChart {...TEST_CHART_PROPS_COMMON} gap={0} />);

      const buttons = getAllByRole('button');

      /**
       * Every interactive segment must have a non-empty aria-label so that
       * screen-readers can announce the segment without any configuration.
       */
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach((button) => {
        expect(button.getAttribute('aria-label')).toBeTruthy();
      });
    });

    it('uses getSegmentAriaLabel factory for segment aria-labels', () => {
      const { getAllByRole } = render(
        <PieDonutChart
          {...TEST_CHART_PROPS_COMMON}
          gap={0}
          getSegmentAriaLabel={(segment) => `Segment value: ${segment.value}`}
        />
      );

      const buttons = getAllByRole('button');

      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach((button) => {
        expect(button.getAttribute('aria-label')).toMatch(/^Segment value: /);
      });
    });

    it('interactive segments have aria-pressed reflecting selection state', () => {
      expect.assertions(1);

      const firstId = TEST_CHART_PROPS_COMMON.data[0].id as string;

      const { getAllByRole } = render(<PieDonutChart {...TEST_CHART_PROPS_COMMON} gap={0} selected={firstId} />);

      const buttons = getAllByRole('button');
      const pressedButtons = buttons.filter((b) => b.getAttribute('aria-pressed') === 'true');

      expect(pressedButtons.length).toBe(1);
    });
  });

  describe('keyboard interaction', () => {
    it('Space key activates a segment (calls onSegmentKeyEnterDown)', () => {
      expect.assertions(1);

      const onSegmentKeyEnterDown = jest.fn();

      const { getAllByRole } = render(
        <PieDonutChart {...TEST_CHART_PROPS_COMMON} gap={0} onSegmentKeyEnterDown={onSegmentKeyEnterDown} />
      );

      const [firstButton] = getAllByRole('button');

      firstButton.focus();
      userEvent.keyboard(' ');

      expect(onSegmentKeyEnterDown).toHaveBeenCalledTimes(1);
    });

    it('Enter key activates a segment (calls onSegmentKeyEnterDown)', () => {
      expect.assertions(1);

      const onSegmentKeyEnterDown = jest.fn();

      const { getAllByRole } = render(
        <PieDonutChart {...TEST_CHART_PROPS_COMMON} gap={0} onSegmentKeyEnterDown={onSegmentKeyEnterDown} />
      );

      const [firstButton] = getAllByRole('button');

      firstButton.focus();
      userEvent.keyboard('{Enter}');

      expect(onSegmentKeyEnterDown).toHaveBeenCalledTimes(1);
    });

    it('Tab key moves focus between segments', () => {
      expect.assertions(2);

      const data = TEST_CHART_PROPS_COMMON.data.slice(0, 2);

      const { getAllByRole } = render(<PieDonutChart {...TEST_CHART_PROPS_COMMON} data={data} gap={0} tabIndex={0} />);

      const [first, second] = getAllByRole('button');

      first.focus();
      expect(document.activeElement).toBe(first);

      userEvent.tab();
      expect(document.activeElement).toBe(second);
    });
  });
});
