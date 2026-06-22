import { useEffect, useLayoutEffect } from 'react';

import { isClient } from 'utils/env';

/**
 * Internal helper hook (not part of the public API).
 *
 * "useLayoutEffect" runs synchronously after DOM mutations, which is exactly
 * what this library needs for measuring/observing the chart's container size
 * without a visible flash. React, however, prints a warning (and does
 * nothing) when "useLayoutEffect" is used during server-side rendering
 * ("react-dom/server"'s renderToString/renderToStaticMarkup), since there is
 * no DOM to measure there.
 *
 * This hook resolves to the real "useLayoutEffect" in a browser environment
 * and falls back to "useEffect" (a no-op during SSR, same as
 * "useLayoutEffect" would effectively be) everywhere else, removing the SSR
 * warning without changing any client-side behavior.
 *
 * @function useIsomorphicLayoutEffect (internal hook)
 */
export const useIsomorphicLayoutEffect = isClient() ? useLayoutEffect : useEffect;
