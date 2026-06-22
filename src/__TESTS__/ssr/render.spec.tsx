import { PieDonutChart } from 'components/PieDonutChart';
import React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { TEST_CHART_PROPS_COMMON } from 'tests/mocks/variables';

/**
 * "react-dom/server"'s renderToString/renderToStaticMarkup never run React
 * effects (useEffect/useLayoutEffect) at all — this is true regardless of
 * whether "window"/"document" happen to exist in the surrounding process —
 * making these functions a faithful way to exercise the exact code path a
 * real Node.js SSR server (Next.js, Express + ReactDOMServer, etc.) would
 * use to render this component, without needing a separate no-DOM Jest
 * environment.
 *
 * Whether the library correctly avoids React's "useLayoutEffect does nothing
 * on the server" warning in a true no-DOM environment (rather than this
 * jsdom-based Jest environment, where "window" exists globally regardless of
 * which render function is called) is covered directly in
 * "useIsomorphicLayoutEffect.spec.ts", which simulates a missing "window" at
 * module-load time.
 */
describe('SSR safety', () => {
  it('importing the component does not throw and yields a function', () => {
    expect.assertions(1);

    expect(typeof PieDonutChart).toBe('function');
  });

  it('renderToString does not throw and produces an <svg>', () => {
    expect.assertions(2);

    let html = '';

    expect(() => {
      html = renderToString(<PieDonutChart {...TEST_CHART_PROPS_COMMON} />);
    }).not.toThrow();

    expect(html).toContain('<svg');
  });

  it('renderToStaticMarkup does not throw and produces an <svg>', () => {
    expect.assertions(2);

    let html = '';

    expect(() => {
      html = renderToStaticMarkup(<PieDonutChart {...TEST_CHART_PROPS_COMMON} />);
    }).not.toThrow();

    expect(html).toContain('<svg');
  });

  it('renders without a "parentRef" (fixed "size" prop only, no resize observer needed)', () => {
    expect.assertions(2);

    let html = '';

    expect(() => {
      html = renderToString(<PieDonutChart data={TEST_CHART_PROPS_COMMON.data} size={200} />);
    }).not.toThrow();

    expect(html).toContain('<svg');
  });
});
