# Stage 04 — Test suite on Node 24

## Summary

- Restored the local Jest test suite under Node 24 — `pnpm run test` now passes
  (54/54 suites, 141/141 tests), down from 1 failed suite (4-5 failed assertions)
  before this PR.
- `pnpm run test:cover` also passes, reporting ~99.5% statement coverage.
- Found and fixed the **actual** root cause, which turned out to be different from
  what earlier maintenance stages (Stage 01–03) had speculated. It was not a Node 24
  / jsdom console-mock incompatibility.
- Kept CI disabled (Stage 01).
- Kept publish disabled/no-op (Stage 01).

## Previous failure

Before this PR, `pnpm run test` failed in
`src/hooks/__TESTS__/helpers/useHandleResize/startResizeListener/processResizeMutation.spec.ts`:

```
expect.assertions(1)
Expected one assertion to be called but received zero assertion calls.
```

and

```
TypeError: Cannot read properties of undefined (reading '0')
  at consoleErrorMocked.mock.calls[0][0]
```

i.e. `consoleErrorMocked` (a `jest.spyOn(console, 'error')` mock) had **zero**
recorded calls in tests that expected the code under test to call `console.error`.

## Root cause

**Not** a Jest/jsdom/console-mock-API incompatibility, and **not** specific to
Node 24. The actual cause:

`src/hooks/helpers/useHandleResize/startResizeListener/processResizeMutation.ts`
(and other test-only error-logging call sites in this codebase) gate their
`consoleError(...)` calls behind `isTest()`, defined in `src/utils/env.ts` as:

```ts
export const isProduction = () => process.env.NODE_ENV === 'production';
export const isTest = () => !isProduction() && process.env.NODE_ENV === 'test';
```

Jest's CLI only sets `process.env.NODE_ENV = 'test'` **when it is not already
defined**. On this machine, `NODE_ENV` was already set to `production` as a
persistent **Windows user-level environment variable**, set outside of this
repository (unrelated tooling from another project). Because it was already
defined, Jest never overrode it, `isProduction()` returned `true`, `isTest()`
returned `false`, and `consoleError(...)` was silently never called — so the
mocks correctly recorded zero calls; there was nothing wrong with the mocks
themselves.

This was verified directly by adding a temporary debug test that printed
`process.env.NODE_ENV` during a Jest run: it printed `"production"`. After the
fix below, it correctly prints `"test"`.

This also means the root-cause description in the Stage 01–03 maintenance docs
("`console.error` mock behavior changed in Node 24 / newer jsdom") was an
**unverified guess** made before this investigation and turned out to be
incorrect — documented here for the record.

### Two secondary, genuinely Node-24/dependency-related issues found after fixing the above

Once the primary `NODE_ENV` issue was fixed, two more issues surfaced (previously
hidden because Jest's `bail: 1` stopped at the very first failure):

1. **`Chart.spec.tsx` failed to even compile** under `ts-jest`:
   `TS2339: Property 'toHaveAttribute' does not exist on type 'JestMatchers<HTMLElement>'`.
   Root cause: `@testing-library/jest-dom@5.17.0` (the installed version) ships
   **no `.d.ts` files of its own** — verified directly by listing its package
   contents. For `jest-dom` v5.x, type definitions were always meant to come from
   the separate DefinitelyTyped package `@types/testing-library__jest-dom`, which
   was **never added** to this repository's `devDependencies`. This was a
   pre-existing, latent gap — it was never caught before because the test suite
   never got far enough to reach a type-checked spec file that used a `jest-dom`
   matcher under `ts-jest`'s non-isolated, full-program type-check mode.
2. **`useChartDataRemap.spec.tsx` recorded an unexpected `console.error` call**:
   `Warning: \`ReactDOMTestUtils.act\` is deprecated in favor of \`React.act\`...`.
   Root cause: `@testing-library/react@13.4.0` (the installed version) internally
   calls the legacy `ReactDOMTestUtils.act` from `react-dom/test-utils`. React
   `18.3.1` (the installed React version) added a deprecation warning (logged via
   `console.error`) for this exact internal usage pattern. `@testing-library/react`
   v14+ updated its internals to use `React.act` when available, avoiding the
   warning.

## Changes

### Test setup

- `src/tests/configs/setup-files.ts`: added `import '@testing-library/jest-dom';`
  directly in this file (a `.ts` file processed by `ts-jest` as part of the shared
  TS program), instead of relying solely on the separate
  `'@testing-library/jest-dom/extend-expect'` plain-JS entry in
  `setupFilesAfterEnv`. This was attempted as a possible fix for the type issue
  but, as documented above, the actual fix was installing the missing
  `@types/testing-library__jest-dom` package — this import is kept as the
  modern (non-deprecated `/extend-expect` subpath) way to register jest-dom's
  runtime matcher extensions, and doesn't hurt.
- `src/tests/configs/setup-env.ts`: was an empty placeholder (`export {};`).
  Now explicitly sets `process.env.NODE_ENV = 'test'` before the test framework
  is installed, with a comment explaining why this is necessary (so the test
  suite is robust against ambient/machine-level `NODE_ENV` values on **any**
  contributor's machine or CI runner, not just this one).

### Config

- `jest.config.js`: removed the deprecated `'@testing-library/jest-dom/extend-expect'`
  entry from `setupFilesAfterEnv` (superseded by the `import` in `setup-files.ts`
  above — keeping both would have been redundant).

### Test dependencies (targeted updates only)

| Package | Before | After | Why |
|---|---|---|---|
| `@testing-library/react` | `^13.0.0` (resolved 13.4.0) | `^14.3.1` | Fixes the `ReactDOMTestUtils.act` deprecation warning under React 18.3+ |
| `@types/testing-library__jest-dom` | _not installed_ | `5.14.9` (new) | Was always required for `@testing-library/jest-dom` v5.x type support; this gap pre-dates this PR |

No other test or non-test dependencies were touched. `jest`, `ts-jest`,
`@testing-library/jest-dom`, `@types/jest`, `babel-jest`, and `react`/`react-dom`
versions are all unchanged.

### Scripts

- Added optional `type-check:test` script (`tsc --noEmit -p tsconfig.test.json`),
  per the maintenance task's guidance. **Not** wired into `pre-commit` or
  `prebuild` — kept as a standalone, opt-in command for now, to keep this PR's
  required-gate scope minimal. It currently passes cleanly (exit 0), so wiring it
  into `pre-commit` is a safe, low-risk follow-up for a future PR.

## Local checks (Node 24.15.0 / Windows / pnpm 10.32.1)

- `pnpm install`: ✅ passed
- `pnpm run check`: ✅ passed (0 errors, same 29 pre-existing warnings as Stage 02/03)
- `pnpm run lint`: ✅ passed
- `pnpm run format:check`: ✅ passed
- `pnpm run type-check`: ✅ passed
- `pnpm run type-check:test` (new, optional): ✅ passed
- `pnpm run build`: ✅ passed
- **`pnpm run test`: ✅ passed — 54/54 suites, 141/141 tests** (was 1 failed suite before this PR)
- **`pnpm run test:cover`: ✅ passed — 54/54 suites, 141/141 tests, ~99.5% statement coverage**

## Known issues left for later PRs

- CI remains disabled (Stage 01).
- Publish workflow remains no-op (Stage 01).
- Dependency cleanup / Dependabot alerts remain for later (e.g. `ts-loader`/`ts-node`,
  noted as unused in Stage 03, still not removed).
- Runtime bugfix / performance / a11y work remains for later — no runtime/component
  logic was touched in this PR; the two-line behavior change closest to "runtime"
  is the `setup-env.ts` test-environment fix, which only affects `process.env`
  during Jest runs, not any shipped/published code path.
- `type-check:test` was added but not yet wired into `pre-commit`/`prebuild` as a
  required gate — a reasonable, low-risk next step now that it passes cleanly.
- Stage 01–03 maintenance docs' description of this issue's root cause (Node 24 /
  jsdom console-mock behavior) was inaccurate; this doc supersedes that
  explanation with the verified root cause. The earlier docs were not edited
  retroactively, to preserve an honest history of what was known/unknown at each
  stage.
