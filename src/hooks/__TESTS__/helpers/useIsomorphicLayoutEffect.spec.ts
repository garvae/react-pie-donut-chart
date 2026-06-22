/**
 * "useIsomorphicLayoutEffect" resolves to either the real "useLayoutEffect" or
 * "useEffect" via a top-level ternary, evaluated once when the module is
 * first loaded (the standard, Rules-of-Hooks-compliant pattern for this kind
 * of helper — you cannot conditionally switch between two different hooks at
 * call time for the same component instance).
 *
 * To test both branches of that ternary, the module needs to be re-required
 * fresh (via "jest.isolateModules") once with a real "window"/"document"
 * present (the default jsdom Jest environment) and once with them removed
 * (simulating a true SSR/Node-only environment, where this module would
 * never see a "window" at all). "react" itself is required fresh from
 * *within* the same isolated block in both cases, so the comparison is
 * against the same module instance's "useEffect"/"useLayoutEffect" — react's
 * hook functions are anonymous, so a plain "toBe" against a reference
 * captured from a *different* module instance would be unreliable.
 */
describe('hook "useIsomorphicLayoutEffect"', () => {
  it('resolves to "useLayoutEffect" when "window"/"document" exist (client/browser environment)', () => {
    expect.assertions(1);

    let resolvedHook: unknown;
    let expectedHook: unknown;

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const ReactFresh = require('react');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fresh = require('hooks/helpers/useIsomorphicLayoutEffect');

      resolvedHook = fresh.useIsomorphicLayoutEffect;
      expectedHook = ReactFresh.useLayoutEffect;
    });

    expect(resolvedHook).toBe(expectedHook);
  });

  it('resolves to "useEffect" when "window" is undefined at module-load time (SSR-like environment)', () => {
    expect.assertions(1);

    const originalWindow = global.window;

    // @ts-expect-error - simulating a non-browser (SSR) environment on purpose
    delete global.window;

    let resolvedHook: unknown;
    let expectedHook: unknown;

    try {
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const ReactFresh = require('react');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const fresh = require('hooks/helpers/useIsomorphicLayoutEffect');

        resolvedHook = fresh.useIsomorphicLayoutEffect;
        expectedHook = ReactFresh.useEffect;
      });
    } finally {
      global.window = originalWindow;
    }

    expect(resolvedHook).toBe(expectedHook);
  });

  it('resolves to "useEffect" when "document" is undefined at module-load time (SSR-like environment)', () => {
    expect.assertions(1);

    const originalDocument = global.document;

    // @ts-expect-error - simulating a non-browser (SSR) environment on purpose
    delete global.document;

    let resolvedHook: unknown;
    let expectedHook: unknown;

    try {
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const ReactFresh = require('react');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const fresh = require('hooks/helpers/useIsomorphicLayoutEffect');

        resolvedHook = fresh.useIsomorphicLayoutEffect;
        expectedHook = ReactFresh.useEffect;
      });
    } finally {
      global.document = originalDocument;
    }

    expect(resolvedHook).toBe(expectedHook);
  });
});
