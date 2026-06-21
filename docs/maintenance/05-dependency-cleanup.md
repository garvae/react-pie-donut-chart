# Stage 05 — Dependency cleanup and vulnerability reduction

## Summary

- Removed 25 proven-unused dev dependencies (and the dead `babel.config.js` file)
  after the pnpm/Biome/tsup/test modernization completed in Stages 01–04.
- `pnpm-lock.yaml` shrank by hundreds of resolved packages.
- Full `pnpm audit`: **38 → 0 vulnerabilities**.
- Production `pnpm audit --prod`: **0 → 0** (was already clean; confirmed unchanged).
- Added optional `check:all` script (not wired into CI, which remains disabled).
- Kept CI disabled, publish disabled/no-op, no npm publish.

## Runtime dependency status

- dependencies: `{}` (empty — confirmed via direct inspection of `package.json`)
- peerDependencies: `{ "react": ">=16" }` (unchanged)
- devDependencies only vulnerabilities: **yes** — `pnpm audit --prod` reported zero
  vulnerabilities both before and after this PR; all 38 originally-reported
  vulnerabilities were exclusively in the dev/tooling dependency tree (test
  runner, build tooling, doc generation, legacy css/lint plugins), never in
  anything shipped to consumers.

## Removed dependencies

Each was proven unused via `Select-String`/`grep`-equivalent search across the
whole repo (excluding `node_modules`, `.git`, `dist`, `pnpm-lock.yaml`) before
removal, plus a full local check suite re-run after removal.

### Simple, zero-usage packages

- **`ts-loader`**
  - previous purpose: webpack TypeScript loader (pre-dates even the old Rollup
    build; webpack was never used in any build script found in this repo)
  - evidence: zero references anywhere outside its own `package.json` entry
  - verification: `pnpm run check/type-check/build/test` all passed after removal
- **`ts-node`**
  - previous purpose: unclear/legacy — no script or config invoked it
  - evidence: zero references anywhere
  - verification: same as above
- **`is-ci`**
  - previous purpose: unclear/legacy — no script or config invoked it
  - evidence: zero references anywhere
  - verification: same as above
- **`prepend`**
  - previous purpose: unclear/legacy — not in the task's original candidate
    list, found during a full devDependency sweep
  - evidence: zero references anywhere except its own `package.json` entry
  - verification: same as above
- **`node-sass`** / **`@types/node-sass`**
  - previous purpose: SCSS compilation — but the project ships zero `.scss`/
    `.sass` source files (confirmed in Stage 01) and `node-sass@7` already fails
    to install on Node 24 (documented in Stage 01/02: missing Python `distutils`)
  - evidence: zero usage in any script/config beyond `package.json` entries and
    the now-removed `pnpm.onlyBuiltDependencies` reference
  - verification: same as above
- **`react-error-overlay`**
  - previous purpose: unclear — historically a Create React App dev-server error
    overlay; this is a component library, not a CRA app
  - evidence: `pnpm why react-error-overlay` showed it had **zero transitive
    dependents** — nothing in the dependency tree actually needed it, meaning the
    `resolutions`/`pnpm.overrides` pin for it (carried over from the original
    Yarn-era config, before Stage 01) was protecting against nothing. Both the
    devDependency and the now-pointless override entries were removed.
  - verification: same as above
- **`pre-commit`** (the npm package, distinct from the `"pre-commit"` npm
  *script* and from Husky)
  - previous purpose: legacy (~2015-era) git-hook installer
  - evidence: `git config core.hooksPath` is set to `.husky` (set by Husky's
    `install` command), which **bypasses** the `pre-commit` package's mechanism
    entirely. There is also no top-level `"pre-commit"` config array in
    `package.json` (the format that package reads to know what to run) — so it
    had no instructions to execute even if it were somehow still wired in.
    It was also listed in `pnpm.onlyBuiltDependencies` purely because Stage 01's
    `pnpm approve-builds` step had approved its install script to run, not
    because anything depended on its behavior.
  - verification: same as above
  - **Note (found, not fixed — out of scope for dependency cleanup):**
    `.husky/` currently contains only its internal `_` helper folder — there is
    **no `.husky/pre-commit` script file**, so no pre-commit hook is actually
    active right now via Husky either. This is a pre-existing gap, unrelated to
    the dependencies removed here. Left for a future PR.
- **`babel-plugin-react-css-modules`** / **`babel-plugin-transform-postcss`**
  - previous purpose: CSS Modules / PostCSS integration for Babel — but this
    project has no CSS/SCSS source files and `babel.config.js`'s `plugins`
    array never referenced either of these two plugins by name
  - evidence: zero references anywhere, including inside `babel.config.js` itself
  - verification: same as above

### The entire Babel toolchain (15 packages + `babel.config.js`)

This was the largest and highest-risk removal in this PR, verified with an
explicit experiment before touching `package.json`: `babel.config.js` was
temporarily renamed out of the way, and **`pnpm run test` and `pnpm run build`
both still passed with exit code 0** — proving Babel was not actually being
invoked by either pipeline. Root cause: `jest.config.js`'s `transform` option is
hardcoded to `{ '^.+\\.(t|j)sx?$': 'ts-jest' }` (TypeScript-only, no `babel-jest`
in the transform map), and the production build has used `tsup`/esbuild since
Stage 03 (esbuild does not invoke Babel). `babel.config.js` had become fully
dead code after Stage 03, just never removed.

Removed: `@babel/cli`, `@babel/core`, `@babel/generator`, `@babel/parser`,
`@babel/plugin-proposal-class-properties`,
`@babel/plugin-proposal-object-rest-spread`,
`@babel/plugin-proposal-optional-chaining`, `@babel/plugin-syntax-dynamic-import`,
`@babel/plugin-transform-modules-commonjs`, `@babel/plugin-transform-runtime`,
`@babel/preset-env`, `@babel/preset-react`, `@babel/preset-typescript`,
`@babel/runtime`, `babel-jest`, and the `babel.config.js` file itself.

Verification: full local check suite (`check`, `lint`, `format:check`,
`type-check`, `type-check:test`, `build`, `test`, `test:cover`) re-run after
removal — **all passed**, including `pnpm run build` (identical output filenames,
near-identical bundle size: 65.4 KB → 65.5 KB CJS — the few-hundred-byte
difference is from the unrelated `module` field correction already made in
Stage 03) and `pnpm run test` (54/54 suites, 141/141 tests, unchanged).

### The jsdoc toolchain (3 packages)

- **`jsdoc`**, **`jsdoc-babel`**, **`jsdoc-to-markdown`**
  - previous purpose: API documentation generation from JSDoc comments
  - evidence: a full sweep of `package.json`'s `"scripts"` confirmed **no script
    invokes any of these three packages**, and no `.jsdoc.json`/`jsdoc.conf.json`
    config file references `jsdoc-babel` as a plugin. Completely orphaned.
  - verification: full check suite passed after removal

## Kept (investigated, proven still needed or intentionally left)

- **`tslib`** — `tsconfig.base.json` has `"importHelpers": true`, which causes
  `ts-jest`'s transpilation output (used to actually run tests, unlike `tsc
  --noEmit`) to emit `require('tslib')`/`import ... from 'tslib'` for compiler
  helper functions. Removing it would break `pnpm run test`. Kept.
- **`cpx`** — actively used in `copy:license`/`copy:readme`/`copy:types`
  scripts, part of the `postbuild` pipeline (confirmed working in every build
  run in this PR). Kept.
- **`size-limit`** / **`@size-limit/preset-small-lib`** — investigated per the
  task's explicit caution ("do not auto-remove, check if it's a useful public
  maintenance command first"). Running `pnpm run size` directly shows it is
  currently **broken** (`ERROR Create Size Limit config in package.json` — no
  `"size-limit"` config array exists), but per the task's guidance this needs a
  human judgment call about restoring vs. removing the feature, not a unilateral
  removal in a dependency-cleanup PR. **Left in place, documented as broken**,
  for a future PR to either configure properly or remove deliberately.
- **`husky`** / **`lint-staged`** — actively configured (`core.hooksPath=.husky`,
  `lint-staged` config block present), kept. (See the pre-commit hook gap noted
  above — Husky itself is wired at the git-config level but is missing its
  actual hook script file; this is a functionality gap, not a dependency issue.)
- **`@testing-library/user-event`** — confirmed actively imported in multiple
  spec files (`Chart.spec.tsx`, `useClickOutside`/`useResize*` specs,
  `tabIndex.spec.tsx`, `segment-s...` user-behavior specs). Kept, not updated
  (still `^13.2.1` — a version bump wasn't required to fix any vulnerability or
  failing check, so it was left alone per the "targeted updates only" rule).

## Updated dependencies (targeted vulnerability fixes via `pnpm.overrides`)

All four vulnerability fixes were applied as transitive-dependency version
overrides (`pnpm.overrides` in `package.json`), **not** as direct
`devDependencies` version bumps, since none of the four vulnerable packages are
direct dependencies of this project — they are nested inside `cpx` (via
`chokidar`), `@size-limit/preset-small-lib` (via `@size-limit/esbuild`),
`ts-jest`, `tsup`, and `jest` (via `babel-plugin-istanbul`).

- **`braces`**
  - from: `<3.0.3` (pulled in by `cpx > chokidar > anymatch/readdirp > micromatch > braces`)
  - to: `>=3.0.3` (override; resolved to the latest, `3.0.3`)
  - reason: high-severity uncontrolled resource consumption (GHSA-grv7-fg5c-xmjg)
  - verification: `pnpm why braces` shows exactly one resolved version
    project-wide after the override; `pnpm run build` (which exercises `cpx`'s
    `copy:*` scripts) passed
- **`micromatch`**
  - from: `<4.0.8` (same `cpx > chokidar` chain)
  - to: `>=4.0.8` (override; resolved to the latest, `4.0.8`)
  - reason: moderate ReDoS (GHSA-952p-6rrq-rcjv)
  - verification: same as `braces`
- **`esbuild`**
  - from: two separate instances — `0.18.20` (via
    `@size-limit/preset-small-lib > @size-limit/esbuild`, vulnerable `<=0.24.2`)
    and `0.27.7` (via `tsup`/`ts-jest`, vulnerable in the `>=0.27.3 <0.28.1` range)
  - to: single unified `>=0.28.1` override (resolved to the latest, `0.28.1`,
    for **both** previously-separate instances)
  - reason: moderate dev-server CORS issue (GHSA-67mh-4wv8-2f99) + low
    Windows arbitrary-file-read issue (GHSA-g7r4-m6w7-qqqr)
  - verification: this was the highest-risk override, since it affects the
    `esbuild` instance actually used by `tsup` (the production build tool) and
    `ts-jest` (the test transpiler). `pnpm why esbuild` confirmed deduplication
    to a single `0.28.1` instance shared by `@size-limit/esbuild`,
    `bundle-require` (tsup), `ts-jest`, and `tsup` itself. **`pnpm run build`**
    (produces byte-for-byte comparable output to before) and **`pnpm run
    test`/`test:cover`** (54/54 suites, 141/141 tests, including coverage
    collection) all passed after the bump — confirmed compatible.
- **`js-yaml`**
  - from: `<=4.1.1` (via `jest > @jest/core > @jest/transform >
    babel-plugin-istanbul > @istanbuljs/load-nyc-config > js-yaml`)
  - to: `4.2.0` (override — **deliberately pinned within the same major
    version**, not bumped to the newly-released `5.0.0`, to avoid an
    unnecessary major-version jump inside Jest's internal coverage
    instrumentation chain, which this project does not control or test
    directly)
  - reason: moderate quadratic-complexity DoS in YAML merge-key handling
    (GHSA-h67p-54hq-rp68)
  - verification: `pnpm run test:cover` (which exercises this exact code path
    via `babel-plugin-istanbul`'s coverage instrumentation) passed — 54/54
    suites, 141/141 tests, full coverage report generated successfully

## Audit results

- Full audit before: **38 vulnerabilities** (2 low, 21 moderate, 14 high, 1 critical)
- Full audit after: **0 vulnerabilities**
- Production audit (`pnpm audit --prod`) before: **0 vulnerabilities**
- Production audit (`pnpm audit --prod`) after: **0 vulnerabilities** (unchanged — confirms no runtime/published risk existed or exists)

## Local checks

- `pnpm install`: ✅ passed
- `pnpm run check`: ✅ passed (0 errors, same 28 pre-existing non-blocking warnings as Stage 02–04, one fewer than before — `noConsole` dropped from 8 to 7 since a console call inside now-removed dead code is gone)
- `pnpm run lint`: ✅ passed
- `pnpm run format:check`: ✅ passed
- `pnpm run type-check`: ✅ passed
- `pnpm run type-check:test`: ✅ passed
- `pnpm run build`: ✅ passed (`dist/index.js`, `dist/react-pie-donut-chart.esm.js` unchanged filenames, near-identical size)
- `pnpm run test`: ✅ passed — 54/54 suites, 141/141 tests
- `pnpm run test:cover`: ✅ passed — 54/54 suites, 141/141 tests, ~99.5% statement coverage (unchanged from Stage 04)
- `pnpm run check:all` (new, optional, not wired into CI): ✅ passed

## Known issues left for later PRs

- CI remains disabled (Stage 01).
- Publish workflow remains no-op (Stage 01).
- Any remaining dev-only vulnerabilities: **none** — full audit is clean.
- `size-limit`/`@size-limit/preset-small-lib` are kept but currently
  **non-functional** (`pnpm run size` errors out — missing `"size-limit"` config
  array in `package.json`). Needs a deliberate decision in a future PR: either
  add the missing config (restore the feature) or remove the package
  intentionally (not bundled into this cleanup PR per the task's explicit
  caution against auto-removing it).
- `.husky/pre-commit` hook script file is missing — `core.hooksPath` is
  correctly set to `.husky`, but no actual hook script exists there, so no
  pre-commit checks currently run automatically on `git commit` for anyone
  working in this repo. Found during investigation of the (now-removed)
  `pre-commit` package; left as-is since restoring hook *behavior* is outside
  this PR's "dependency cleanup" scope.
- `check:all` was added as an optional local script but intentionally not wired
  into `.github/workflows/*` (CI is still paused) or into Husky hooks.
- Many remaining devDependencies are still several majors behind latest
  (`jest`/`ts-jest`/`typescript`/`@testing-library/jest-dom`/etc. — see
  `pnpm outdated` output saved under `.workspace.local/001-audit/`), but per
  the task's hard rules, no blanket/scope-creep updates were made — only the
  four targeted overrides documented above, each justified by closing a
  specific vulnerability and each individually verified against the full local
  check suite.
