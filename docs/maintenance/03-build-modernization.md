# Stage 03 — Build modernization (tsup replaces rollup-plugin-typescript2)

## Summary

- Replaced the Rollup + `rollup-plugin-typescript2` build with `tsup` (esbuild-based).
- Root cause of the build failure documented in Stage 02 is now fixed: `tsup run`
  compiles `src/index.ts` successfully where `rollup-plugin-typescript2` previously
  crashed with `Unexpected token` parsing `PieDonutChart.tsx`.
- Restored a standalone type-check step (`tsc --noEmit`), since esbuild (which tsup
  uses) does not type-check — see "Type-checking" section below for why this matters.
- Output filenames and `package.json` resolution fields (`main`, `module`, `typings`,
  `umd:main`) are unchanged from before this PR — existing consumers resolve the
  package exactly as before.
- Fixed two small pre-existing packaging bugs discovered while verifying build output
  (see "Bugs fixed" below).

---

## Why the old build was broken

`rollup-plugin-typescript2` (last released for TS \<4.7-era tooling) fails to parse
modern TypeScript syntax under the Node 24 / TypeScript 4.6 combination in this repo,
throwing `Unexpected token` while parsing `src/components/PieDonutChart.tsx`. This was
confirmed and documented as a known, separate issue in Stage 02 (lint migration did
not touch the build step). It is a tooling compatibility issue, not a bug in the
chart source code.

---

## What was replaced

| Old | New |
|---|---|
| `rollup@2.80.0` + `rollup-plugin-typescript2` + `@rollup/plugin-commonjs` + `@rollup/plugin-node-resolve` + `@rollup/plugin-replace` + `rollup-plugin-analyzer` + `rollup-plugin-license` + `rollup-plugin-peer-deps-external` | `tsup@8.5.1` (wraps esbuild) |
| `rollup.config.js` | `tsup.config.ts` |
| `npm run rollup:compile` (`rollup src/index.ts --file dist/index.js --format cjs -c rollup.config.js`) | `npm run tsup:compile` (`tsup`) |
| _(implicit, via rollup-plugin-typescript2)_ TypeScript type-checking during build | explicit `npm run type-check` (`tsc --noEmit -p tsconfig.build.json`), wired into `prebuild` |
| `build:index-cleanup` (`scripts/clean-dist-index.js`, stripped a stray Microsoft/tslib license comment block that `rollup-plugin-typescript2` injected) | removed — esbuild does not inject this comment, the cleanup step has nothing to do |

---

## tsup configuration decisions

### Two separate build passes (CJS + ESM with distinct filenames)

`tsup.config.ts` defines an array of two configs — one per format — each with its
own `entry` key, so the **exact same output filenames as before** are produced:

- `dist/index.js` (CJS) — unchanged path, matches `main`/`umd:main`
- `dist/react-pie-donut-chart.esm.js` (ESM) — unchanged path, matches `module`

By default tsup names ESM output `<entry>.mjs`; an `outExtension` override
(`() => ({ js: '.js' })`) on the ESM config forces the legacy `.js` extension instead,
to avoid introducing a new file path.

**Why exact filename parity matters:** the published `dist/package.json`'s `main`/
`module`/`typings`/`umd:main` fields are how consumers resolve the package (via
bundler `module` field resolution, Node's `main` field, or TS's `typings` field).
README only documents the top-level `import PieDonutChart from
'@garvae/react-pie-donut-chart'` usage (no deep-import paths), so changing internal
filenames carried low risk either way — but keeping them identical removes that risk
entirely. This is "Variant A" (maximum compatibility) rather than introducing a
modern `exports` map, which was intentionally not added in this PR.

### JSX transform: classic, not automatic

`esbuildOptions` forces `options.jsx = 'transform'` with `jsxFactory:
'React.createElement'` / `jsxFragment: 'React.Fragment'`. This matches
`tsconfig.base.json`'s `"jsx": "react"` (classic transform) and, more importantly,
matches `peerDependencies.react: ">=16"`. esbuild's default **automatic** JSX runtime
emits `import { jsx } from 'react/jsx-runtime'`, which does not exist in React
16.0–16.13 (the `react/jsx-runtime` entry point was added in 16.14). Using the
automatic runtime here would have silently broken the package for any consumer on an
older React 16.x patch version still covered by the declared peer dependency range.

### `external: ['react', 'react-dom']`

Matches the old `rollup-plugin-peer-deps-external()` behavior — peer dependencies are
never bundled into the output.

### `target: 'es2017'`

The old `tsconfig.base.json` target was `es6` (= `es2015`). `es2017` was chosen as a
close, still-conservative modern equivalent (esbuild's default with no `target` set is
`esnext`, which would not transpile newer syntax at all — too risky for a published
library with a wide consumer base). This can be revisited in a future PR if a stricter
target is desired.

### License banner

The old `rollup-plugin-license` prepended `LICENSE` file content as a banner comment
to the bundle. tsup's `banner.js` option is used to read `LICENSE` and prepend the
same content, preserving this behavior.

### `dts: false` — hand-written types are still copied verbatim, not regenerated

**This is the most important decision in this PR.** `dist/index.d.ts` /
`src/types/index.d.ts` is a **hand-written, hand-maintained** type declaration file
(not auto-generated from source) — it uses `export = PieDonutChart` /
`exports.PieDonutChart` (a CommonJS-style export assignment) and contains carefully
authored JSDoc documentation for every prop. The `copy:types` script
(`cpx src/types/index.d.ts dist`) copies this file into `dist/index.d.ts` verbatim, as
it always has.

tsup/esbuild can auto-generate `.d.ts` files from source (`dts: true`), but doing so
here would **replace this hand-curated public type/documentation surface** with a
mechanically-generated one with a different shape (esbuild's dts pass does not
understand `export =` semantics the same way, and would not preserve the JSDoc
authoring). That is a public-API-shape change, which is explicitly out of scope for a
build-tooling migration. `dts: false` is set on both tsup configs, and `copy:types`
is unchanged.

---

## Type-checking: restored as an explicit step

`rollup-plugin-typescript2` used `tsc` internally to both type-check and transpile, so
type errors in the build graph (`src/index.ts` and everything it imports) would fail
the old build. esbuild (which tsup uses) **only transpiles — it does not type-check**.
Switching build tools without addressing this would have silently dropped an existing
safety net.

Added `npm run type-check` (`tsc --noEmit -p tsconfig.build.json`), wired into
`prebuild` (now `generate:ts-config && delete:dist && check && type-check`), so a
build still fails on real type errors in production source, matching old behavior.

### New file: `tsconfig.build.json`

A plain `tsc --noEmit -p tsconfig.json` was tried first and surfaced ~80 pre-existing
type errors — but **all of them are in `*.spec.tsx` test files**
(`Property 'toHaveAttribute' does not exist on type 'JestMatchers<...>'`, a known
`@testing-library/jest-dom` v5 + `@types/jest` v28 type-merging issue, already present
before this PR and unrelated to it). The *old* rollup build never actually
type-checked these files either, since Rollup only follows the import graph from
`src/index.ts`, which never reaches test files.

To faithfully reproduce that scope (type-check only the production source that
actually gets built, not test files) `tsconfig.build.json` extends `tsconfig.json`
and additionally excludes `**/__TESTS__/**`, `*.spec.ts(x)`, and `*.test.ts(x)`.
Verified clean: `tsc --noEmit -p tsconfig.build.json` exits 0.

The pre-existing test-file type errors are a separate, already-documented (Stage 01/02)
Node 24 / testing-library tooling issue and are left for a future test-tooling PR.

---

## Bugs fixed (discovered while verifying build output, in scope as build-output correctness)

1. **`scripts/generate-package-json.js`: wrong `module` filename.** The published
   `dist/package.json` hardcoded `"module": "react-pie-chart.esm.js"` (missing
   "donut") while the actual emitted file has always been named
   `react-pie-donut-chart.esm.js`. This means the `module` field in every previously
   published version pointed at a file that does not exist in the package. Fixed to
   `react-pie-donut-chart.esm.js`.
2. **Root `package.json`: wrong `typings` path.** Declared
   `"typings": "dist/types/index.d.ts"`, but `copy:types` has always copied to
   `dist/index.d.ts` (no `types/` subdirectory ever existed). This only affects local
   dev tooling reading the root `package.json` (the *published* `dist/package.json`
   already correctly said `"typings": "index.d.ts"` via its own hardcoded override),
   but it was still wrong and is now fixed to `"typings": "dist/index.d.ts"`.

Both were pre-existing, unrelated to this migration, and discovered only because this
PR required closely re-reading the packaging scripts.

---

## `build:index-cleanup` removed

`scripts/clean-dist-index.js` stripped a Microsoft/tslib license comment block that
`rollup-plugin-typescript2` (via `tslib`'s `importHelpers`) used to inject into the
compiled output. Verified with `Select-String -Pattern "Microsoft"` against the new
`dist/index.js` and `dist/react-pie-donut-chart.esm.js` — esbuild does not produce
this comment, so the cleanup step has nothing left to do. The script and its
`postbuild` invocation were removed.

---

## Local checks (Node 24.15.0 / Windows / pnpm 10.32.1)

- [x] `pnpm run check` — 0 errors, 29 pre-existing warnings (unchanged from Stage 02)
- [x] `pnpm run lint` — 0 errors
- [x] `pnpm run format:check` — 0 errors
- [x] `pnpm run type-check` (new) — 0 errors (production source only, see above)
- [x] **`pnpm run build` — 0 errors. This is the headline result: the build that
  failed in Stage 01 and Stage 02 now succeeds end-to-end.**
  Produces `dist/index.js` (CJS, 65.4 KB), `dist/react-pie-donut-chart.esm.js`
  (ESM, 64.8 KB), plus `dist/index.d.ts`, `dist/package.json`, `dist/LICENSE`,
  `dist/README.md` via the unchanged `postbuild` copy steps.
- [ ] `pnpm run test` — same pre-existing `consoleErrorMocked` / Node 24 jsdom mock
  failures documented in Stage 01/02, unchanged by this PR (1 of 54 suites affected;
  Jest's `bail: 1` stops at the first failure, same as before).

### Smoke tests (manual, not part of the automated suite)

Built output was sanity-checked outside the test runner by requiring/importing it
directly and rendering the component to a static HTML string:

- **CJS** (`require('./dist/index.js')` + `react-dom/server`'s `renderToStaticMarkup`):
  produced a real `<svg>` with expected chart structure. ✅
- **ESM** (`import` `./dist/react-pie-donut-chart.esm.js` from a `.mjs` script):
  produced the same `<svg>` output. ✅ Node printed an informational
  `[MODULE_TYPELESS_PACKAGE_JSON]` warning, since `dist/package.json` intentionally
  has no `"type": "module"` (it can't — `dist/index.js` is CJS and shares the same
  `package.json`). This is the same situation the old build was already in (same `.js`
  extension, no `type` field) and does not affect the typical consumer of this
  library — bundlers (webpack/Vite/Rollup-in-app) resolve via the `module` field
  directly and do not depend on Node's native ESM file-type sniffing.

Smoke-test scripts were temporary and removed after verification — not part of the
committed diff.

---

## What was NOT done in this PR

- No `exports` map added to `package.json` (stayed with "Variant A" — maximum
  backward compatibility, unchanged resolution fields).
- No regeneration/commit of `dist/` build output — `dist/` is treated as a release
  artifact (consistent with Stage 01/02) and will be freshly produced by the new
  `tsup` pipeline the next time an actual release build runs.
- No removal of `ts-loader` / `ts-node` from `devDependencies` — both were already
  fully unused before this PR (not part of the old Rollup pipeline either; grep found
  zero references anywhere outside their own `package.json` entries). Left for a
  future dependency-cleanup PR rather than scope-creeping this one.
- No fix for the pre-existing Jest/Node 24 test failures (Stage 01/02 issue, unrelated
  to build tooling).
- No fix for the pre-existing `@testing-library/jest-dom` / `@types/jest` v28 type
  mismatch in spec files (worked around via `tsconfig.build.json` excluding test
  files from the build-time type-check, matching the old build's actual scope — not
  "fixed").
- CI remains intentionally paused (Stage 01).
