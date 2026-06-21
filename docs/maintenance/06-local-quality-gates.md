# Stage 06 — Local quality gates

## Summary

- Added a persistent, repeatable `pack:smoke` script
  (`scripts/package-smoke-test.js`) that packs a real npm tarball and installs
  it into three throwaway consumer projects (CJS, ESM, TypeScript) to verify
  the package actually works the way a real consumer would use it.
- The TypeScript consumer check caught a **real, previously-undetected bug**:
  the published `dist/index.d.ts` did not compile under `tsc` for any external
  consumer. Fixed at the source (`src/types/index.d.ts`) — a types-only fix,
  no runtime behavior changed.
- Configured `size-limit` (Variant A) with limits based on the real measured
  gzipped size, rather than removing it.
- Restored the missing `.husky/pre-commit` hook (Variant A) — and found and
  fixed the actual root cause of why it never existed: `.husky` was entirely
  gitignored, so hook scripts could never have been committed in the first
  place.
- Updated `check:all` to be the full local quality baseline.
- Kept CI disabled.
- Kept publish disabled/no-op.

## Package smoke test

`pack:smoke` (`node scripts/package-smoke-test.js`) does NOT publish anything.
It only uses `npm pack` to create a local tarball and installs that tarball
(via a `file:` reference) into temporary consumer projects under
`.tmp/package-smoke`, which are deleted before and after every run.

What it checks:

- **CJS**: a throwaway consumer installs the tarball + `react`/`react-dom` of
  its own, then `require()`s the package and renders it via
  `react-dom/server`'s `renderToStaticMarkup`, asserting the output contains a
  real `<svg`.
- **ESM**: same, but via a native `import` in a `.mjs` file (consumer
  `package.json` has `"type": "module"`).
- **TypeScript**: a throwaway consumer with its own `typescript` +
  `@types/react`, a minimal `index.tsx` that does
  `import PieDonutChart, { DataItem } from '@garvae/react-pie-donut-chart'`
  (matching the exact pattern documented in `README.md`), compiled with
  `tsc --noEmit` against a strict tsconfig (`strict: true`,
  `skipLibCheck: false` — deliberately **not** skipping lib checking, since the
  whole point is to validate the package's own shipped `.d.ts`).
- **Tarball contents**: `npm pack --json`'s reported file list is checked for
  `dist/index.js`, `dist/react-pie-donut-chart.esm.js`, `dist/index.d.ts`, and
  `dist/package.json`.
- **React peer dependency**: asserts `package.json`'s `dependencies` is empty,
  `peerDependencies.react` is declared, and `dist/index.js` literally contains
  `require('react')` (proving React is externalized, not bundled in).

### Bug found and fixed: broken published `.d.ts`

The very first TypeScript-consumer run failed with:

```
dist/index.d.ts(442,1): error TS1036: Statements are not allowed in ambient contexts.
dist/index.d.ts(443,1): error TS2309: An export assignment cannot be used in a module with other exported elements.
```

Root cause, in `src/types/index.d.ts` (a hand-written, hand-maintained
declaration file — see Stage 03's notes on why it's hand-written rather than
auto-generated):

```ts
declare function PieDonutChart(props: PieDonutChartProps): JSX.Element;
exports.PieDonutChart = PieDonutChart;   // (1) invalid runtime statement in a .d.ts
export = PieDonutChart;                   // (2) conflicts with the file's other `export type` statements
```

1. `exports.PieDonutChart = PieDonutChart;` is a runtime JS assignment
   statement — not valid inside an ambient `.d.ts` declaration file at all.
2. `export = PieDonutChart;` (TypeScript's CommonJS-style export-assignment
   syntax) cannot coexist with the file's other `export type X = ...`
   statements (`DataItem`, `PieDonutChartProps`, etc.) — this is a hard
   TypeScript rule (TS2309).

This had never been caught before because no previous stage actually
type-checked the package as an *external consumer* would (Stage 03/04's
`type-check`/`type-check:test` only check the package's own `src/**/*`, never
the shipped `.d.ts` resolved through `node_modules` the way a real consumer's
compiler does).

**Fix:** checked what the actual compiled JS exports at runtime
(`dist/index.js` has `module.exports = PieDonutChart;` — a plain CommonJS
export-assignment, no `__esModule` flag). The earlier CJS/ESM smoke tests in
Stage 03 already empirically proved this works correctly via Node's own
CJS/ESM interop (`PieDonutChart.default || PieDonutChart` for CJS,
`import PieDonutChart from '...'` for ESM). The correct **type-level**
description of that exact runtime shape — one that also supports the file's
other named `export type` statements — is:

```ts
declare function PieDonutChart(props: PieDonutChartProps): JSX.Element;
export default PieDonutChart;
```

This is a types-only change. `.d.ts` files produce zero JS output, so this
cannot and does not change any runtime behavior — it only makes the already-
correct runtime shape correctly *describable* to TypeScript consumers.
Verified: `pnpm run type-check`, `pnpm run type-check:test`, `pnpm run build`,
and `pnpm run test` all still pass after the change, and `pack:smoke`'s
TypeScript consumer now compiles cleanly.

## Size check

**Decision: configured (Variant A).**

`pnpm run size` was confirmed broken before this PR (`ERROR Create Size Limit
config in package.json` — no `"size-limit"` array existed). Added one:

```json
"size-limit": [
  { "path": "dist/index.js", "limit": "15 KB" },
  { "path": "dist/react-pie-donut-chart.esm.js", "limit": "15 KB" }
]
```

Real measured size (via `size-limit`, which reports **minified + gzipped**
size, not raw bytes — this matters, since raw `dist/index.js` is ~65 KB but
the gzipped size `size-limit` actually measures is much smaller):

- `dist/index.js`: **9.69 KB** gzipped
- `dist/react-pie-donut-chart.esm.js`: **9.79 KB** gzipped

`15 KB` gives roughly 50% headroom above the current size — enough to absorb
normal incremental growth without noise, while still catching meaningful
regressions (e.g. accidentally bundling React, which would push the gzipped
size well past 30-40 KB).

Both `pnpm run size` and `pnpm run analyze` (same underlying `size-limit`
command, kept as an alias since it already existed) pass with the new config.

## Husky

**Decision: hook restored (Variant A).**

### Root cause of the missing hook

`.husky` (the bare directory name, no trailing slash or wildcard) was listed
in `.gitignore`, which excludes the **entire** `.husky/` directory and
everything inside it — meaning no `.husky/*` hook script could ever have been
committed to this repository, regardless of whether one was created locally.
`husky install` (run via `postinstall`/`prepare`) only sets up
`core.hooksPath=.husky` and the internal `.husky/_/husky.sh` helper — it does
**not** auto-generate hook scripts like `pre-commit`; those have to be authored
and committed by the project, which was never possible here.

**Fixed `.gitignore`**: changed the blanket `.husky` ignore to
`.husky/_` only — Husky's own documented convention is to commit the actual
hook scripts (`.husky/pre-commit`, etc.) while gitignoring just the
auto-generated internal `_` helper directory.

### Hook script

Created `.husky/pre-commit`:

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm run check
pnpm run type-check
pnpm run type-check:test
pnpm run test
```

`pnpm run build` was deliberately **not** included (per the task's guidance —
too heavy for a pre-commit hook; it's covered by `check:all` and will be
covered by CI later).

The executable bit was set in the git index directly via
`git update-index --chmod=+x .husky/pre-commit` (confirmed: `git ls-files -s`
shows mode `100755`), since Windows has no native `chmod` — this ensures the
file checks out as executable for any contributor on macOS/Linux/CI.

### Verification

Since this Windows machine doesn't have a `.git/hooks/pre-commit` to invoke
directly (hooks run through `core.hooksPath=.husky`, which only Git itself —
not arbitrary shells — resolves automatically), the hook script was verified
by invoking it directly through Git for Windows' bundled `sh.exe`
(`& "C:\Program Files\Git\bin\sh.exe" .husky\pre-commit`), exactly how Git
itself would invoke it on `git commit`. All four commands ran in sequence and
the script exited 0, with the final `pnpm run test` step reporting
**54/54 suites, 141/141 tests passed**.

## `check:all`

Updated to be the full local quality baseline before CI is restored:

```json
"check:all": "npm run check && npm run type-check && npm run type-check:test && npm run build && npm run test && npm run test:cover && npm run pack:smoke && npm run size"
```

`test:cover` was kept in (not split out) per the task's guidance — before
restoring CI, the full local baseline (including coverage and the new package
smoke test) needs to be known-green as a single command. `pack:smoke` and
`size` were appended at the end, after `build`/`test`/`test:cover`, since both
depend on a fresh `dist/` build and a meaningful test pass already having
happened.

## Local checks (Node 24.15.0 / Windows / pnpm 10.32.1)

- `pnpm install`: ✅ passed
- `pnpm run check`: ✅ passed (0 errors, ~36 non-blocking warnings — the new
  `scripts/package-smoke-test.js` adds several intentional `console.log`
  warnings, since the script is a CLI tool meant to print its own progress;
  not fixed, matches the existing pattern of other CLI scripts like
  `scripts/generate-ts-config.js`)
- `pnpm run lint`: ✅ passed
- `pnpm run format:check`: ✅ passed
- `pnpm run type-check`: ✅ passed
- `pnpm run type-check:test`: ✅ passed
- `pnpm run build`: ✅ passed
- `pnpm run test`: ✅ passed — 54/54 suites, 141/141 tests
- `pnpm run test:cover`: ✅ passed — 54/54 suites, 141/141 tests, ~99.5% coverage
- `pnpm run pack:smoke`: ✅ passed — CJS, ESM, TypeScript consumers all verified
  against a real local tarball; tarball contents and React peer-dependency
  externalization confirmed
- `pnpm run size`: ✅ passed — 9.69 KB / 9.79 KB gzipped, both under the new
  15 KB limits
- `pnpm run check:all`: ✅ passed (full chain, end to end)
- `pnpm audit`: ✅ 0 vulnerabilities (unchanged from Stage 05)

## Known issues left for later PRs

- CI remains disabled (Stage 01).
- Publish workflow remains no-op (Stage 01).
- `check:all` is intentionally not wired into `.github/workflows/*` (CI is
  still paused) or as an additional Husky hook (the pre-commit hook
  deliberately omits the heavier `build`/`test:cover`/`pack:smoke`/`size`
  steps to keep commits fast — those belong in CI once it's restored).
- README/release docs may need a refresh once CI/publish are redesigned.
- Publish automation needs a final redesign (still Stage 01's no-op
  placeholder).
- `pack:smoke`'s `run()` helper uses `shell: true` on Windows to invoke
  `npm`/`npx` (`.cmd` shims can't be resolved by `execFileSync` without a
  shell on Windows) — Node's `DEP0190` deprecation warning is expected and
  was deliberately accepted, since all arguments passed through it are
  internally constructed (never raw/external input), not a real security
  concern here. Documented inline in the script.
