# Stage 07 — SSR safety and memory leak fixes

## Summary

- Fixed three pre-existing runtime safety issues in the component:
  1. `src/utils/env.ts` — unsafe references to `window`/`process` that throw
     in non-browser (SSR/edge) environments.
  2. `src/hooks/helpers/useHandleResize` — `useLayoutEffect` used directly,
     causing React's "useLayoutEffect does nothing on the server" warning
     during SSR rendering, and a `MutationObserver` + event listener memory
     leak (no cleanup function was ever returned).
  3. `src/hooks/useChartStates.ts` — same `useLayoutEffect` direct usage.
- Added 19 new tests across 3 new spec files (and extended 2 existing spec
  files) to cover the fixed code paths.
- All 57 test suites (160 tests) pass.
- `pnpm run check:all` passes end-to-end.
- Kept CI and publish disabled during maintenance.

---

## Changes

### 1. `src/utils/env.ts` — environment guards

**Problem:** Three issues in this file:

a) `export const originalEnv = process.env;` is a **top-level statement**
   executed immediately when the module is first imported — before any render,
   before any effect, before any user code runs. In some SSR/edge runtimes
   (e.g. Cloudflare Workers, Deno, custom `renderToString` environments) there
   is no global `process` object at all, so this throws a `ReferenceError` on
   import.

b) `export const isClient = () => window && typeof window === 'object';` —
   references `window` without a `typeof` guard first. In Node.js/SSR
   environments without a `window` global, this throws `ReferenceError: window
   is not defined`. The intention is clearly to check whether `window` exists,
   but the expression is evaluated left-to-right: `window` is accessed before
   `typeof` can protect anything.

c) `isProduction`/`isTest` — similarly access `process.env` without a
   `process` existence guard.

**Fix:** All three functions and the top-level constant now use `typeof X !==
'undefined'` checks, and `?.` optional chaining for `process.env?.NODE_ENV`:

```ts
export const originalEnv = typeof process !== 'undefined' ? process.env : ({} as NodeJS.ProcessEnv);
export const isClient = () => typeof window !== 'undefined' && typeof document !== 'undefined';
export const isProduction = () => typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';
export const isTest = () => !isProduction() && typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
```

Added `document` check to `isClient` because some test environments and
non-browser runtimes may provide a `window`-like object without a real
`document` — the component expects a real browser DOM, not a partial polyfill.

**Tests added (`src/utils/__TESTS__/env.spec.ts`):**
- `isClient` returns false when `window` is `undefined` (delete global.window)
- `isClient` returns false when `document` is `undefined` (delete global.document)
- `isProduction` returns false when `process` is `undefined` (delete global.process)
- `isTest` returns false when `process` is `undefined` (delete global.process)

---

### 2. `src/hooks/helpers/useIsomorphicLayoutEffect.ts` (new file)

**Problem:** `useLayoutEffect` called directly in two hooks
(`useHandleResize.ts` and `useChartStates.ts`) causes React to print a
`console.error` warning:

> Warning: useLayoutEffect does nothing on the server because its effect cannot
> be encoded into the server renderer's output format. This will lead to a
> mismatch between the initial, non-hydrated UI and the intended UI.

This happens every time a consumer renders this component via
`react-dom/server`'s `renderToString` or `renderToStaticMarkup` (Next.js
server components, Express + ReactDOM, etc.).

**Fix:** Created `src/hooks/helpers/useIsomorphicLayoutEffect.ts` — a standard
isomorphic layout effect helper:

```ts
export const useIsomorphicLayoutEffect = isClient() ? useLayoutEffect : useEffect;
```

The module-level ternary is evaluated once when the module is loaded:
- In a browser/jsdom environment (where `window` and `document` exist) →
  `useLayoutEffect` (synchronous, no visual flash when measuring DOM size)
- In an SSR/Node.js environment (where `window` is undefined at module-load
  time) → `useEffect` (effectively a no-op during server rendering — correct,
  since there is no DOM to measure anyway, and avoids the React SSR warning)

**Why module-level rather than in-hook:** React's Rules of Hooks forbid
conditional hook calls at call time. A module-level ternary (evaluated before
any component renders) is the canonical community pattern for this
(react-use, react-spring, next.js, etc. all do the same).

Applied in:
- `useHandleResize.ts` — 3 `useLayoutEffect` calls replaced
- `useChartStates.ts` — 1 `useLayoutEffect` call replaced

**Tests added (`src/hooks/__TESTS__/helpers/useIsomorphicLayoutEffect.spec.ts`):**
- Resolves to `useLayoutEffect` when `window`/`document` exist (via
  `jest.isolateModules` — the only reliable way to test a module-level
  ternary, since modules are cached after first load)
- Resolves to `useEffect` when `window` is `undefined` at module-load time
- Resolves to `useEffect` when `document` is `undefined` at module-load time

The `jest.isolateModules` pattern used here re-requires both `react` and the
hook module fresh **within the same isolated block**, then compares references
from the same module instance — necessary because React's hook functions are
anonymous (`.name === ''`) and can't be distinguished otherwise.

---

### 3. `src/hooks/helpers/useHandleResize/startResizeListener/startResizeListener.ts` — memory leak fix

**Problem:** `startResizeListener` had **no cleanup** — it created a new
`MutationObserver` and attached a `addEventListener('resize', cb)` on the node
on every call, but **never returned a cleanup function**. Combined with the
`useLayoutEffect` that called it:

```ts
useLayoutEffect(() => {
  startResizeListener({ cb: handleResize, node: parentRef?.current || null });
  // no return value, no cleanup
}, [handleResize, parentRef]);
```

Every time `handleResize` or `parentRef` changed (which happens at least once
during normal initialization — when `size` settles from its initial `0` to the
measured value, causing `handleResize` to get a new identity via `useCallback`),
a new observer and a new event listener were created, while the old ones were
silently leaked — never disconnected, never removed.

There was also a second bug: `startResizeListener` was creating the observer
even when `node` was `null` (e.g. when a fixed `size` prop is provided and
there is no `parentRef` — the resize-observation code path has nothing to
observe in that case).

**Fix:**

```ts
export const startResizeListener = (props: TResizeListener): (() => void) | undefined => {
  const { cb, node } = props;

  if (!node?.nodeName) {
    return undefined;                          // no node → no observer, no listener
  }

  const observer = new MutationObserver(processResizeMutation);
  observer.observe(node, { attributeFilter: ['style'], attributeOldValue: true, attributes: true });
  node.addEventListener('resize', cb);

  return () => {                               // cleanup function (new)
    observer.disconnect();
    node.removeEventListener('resize', cb);
  };
};
```

The return value (cleanup function or `undefined`) is now used directly as the
return value of the `useIsomorphicLayoutEffect` callback in `useHandleResize`:

```ts
useIsomorphicLayoutEffect(
  () => startResizeListener({ cb: handleResize, node: parentRef?.current || null }),
  [handleResize, parentRef]
);
```

React calls this cleanup function before re-running the effect (when
dependencies change) and on unmount — preventing any observer or listener from
being leaked.

**Tests added (`src/hooks/__TESTS__/helpers/useHandleResize/startResizeListener/startResizeListener.spec.ts` — new file):**
- Does not create a `MutationObserver` when `node` is `null`
- Does not create a `MutationObserver` when `node` has no `nodeName`
- Creates and `observe()`s a `MutationObserver` when a valid node is provided
- Attaches the callback as a `resize` event listener
- Returns a cleanup function that calls `disconnect()` and `removeEventListener()`

**Integration tests added (`src/hooks/__TESTS__/helpers/useHandleResize/useHandleResize.spec.tsx`):**
- Observes the `parentRef` node when one is provided (hook level)
- Every observer created during the hook's lifecycle is disconnected by the
  time of unmount (no leaked observers — asserts
  `disconnectMock.calls.length === MutationObserverMock.calls.length`)
- Does not create an observer when a fixed `size` prop is used (no parentRef)

---

### 4. `src/__TESTS__/ssr/render.spec.tsx` (new file)

Exercises the component via `react-dom/server`'s `renderToString` and
`renderToStaticMarkup` — the actual code path any SSR consumer would take.

Server-side rendering functions never run React effects regardless of the test
environment, making them a reliable proxy for real Node.js SSR behavior without
needing a separate Jest environment.

Tests:
- Importing the component does not throw
- `renderToString` produces an `<svg>` without throwing
- `renderToStaticMarkup` produces an `<svg>` without throwing
- Renders correctly with a fixed `size` prop (no parentRef/no observer)

**Note on the `useLayoutEffect` warning during these tests:** The SSR spec
files run under jsdom (the default Jest environment), where `window` and
`document` exist globally, so `useIsomorphicLayoutEffect` resolves to
`useLayoutEffect` when the module is first loaded in that test process — the
correct behavior for a browser environment. React still prints its warning
during `renderToString`/`renderToStaticMarkup` in that case (because
`react-dom/server` intercepts `useLayoutEffect` and logs at that call site,
regardless of how the hook was resolved at module-load time). This is a
test-environment artifact — in a real SSR process, `window` would not exist at
module-load time, `useIsomorphicLayoutEffect` would resolve to `useEffect`, and
the warning would never appear. The `useIsomorphicLayoutEffect.spec.ts` tests
(using `jest.isolateModules` + `delete global.window`) verify this directly.

---

## New test count

| File | New tests |
|---|---|
| `src/utils/__TESTS__/env.spec.ts` (extended) | +4 |
| `src/hooks/__TESTS__/helpers/useIsomorphicLayoutEffect.spec.ts` (new) | +3 |
| `src/hooks/__TESTS__/helpers/useHandleResize/startResizeListener/startResizeListener.spec.ts` (new) | +5 |
| `src/hooks/__TESTS__/helpers/useHandleResize/useHandleResize.spec.tsx` (extended) | +4 |
| `src/__TESTS__/ssr/render.spec.tsx` (new) | +4 |
| **Total** | **+19** |

Test suites before: **54**, after: **57**  
Tests before: **141**, after: **160**

---

## Local checks

- `pnpm run check`: ✅ 0 errors
- `pnpm run lint`: ✅ 0 errors
- `pnpm run format:check`: ✅ 0 errors
- `pnpm run type-check`: ✅ 0 errors
- `pnpm run type-check:test`: ✅ 0 errors
- `pnpm run build`: ✅ 0 errors
- `pnpm run test`: ✅ **57/57 suites, 160/160 tests** (was 54/141)
- `pnpm run test:cover`: ✅ 57/57 suites, 160/160 tests
- `pnpm run pack:smoke`: ✅ CJS/ESM/TypeScript consumers verified
- `pnpm run size`: ✅ within limits
- `pnpm run check:all`: ✅ exit 0

---

## What was NOT done

- ResizeObserver-based replacement for MutationObserver: not changed — the
  existing MutationObserver mechanism works in all browsers the peer dep range
  covers and there is no failing test showing a behavioral defect. The fix was
  a structural fix (add cleanup + null-guard), not a rewrite.
- `useHandleResize` still guards size measurement behind `isClient()` — this is
  correct and unchanged.
- No changes to public props, exported types, or public API.
- No `exports` map changes.
- No `dist/` committed.
- CI remains disabled (Stage 01).
- Publish remains no-op (Stage 01).
