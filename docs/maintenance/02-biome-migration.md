# Stage 02 — Biome migration (ESLint + Prettier + Stylelint replaced)

## Summary

- Replaced ESLint 7 + Prettier 2 + Stylelint 13 with a single Biome 2.5 toolchain
  for linting and formatting.
- Removed all CSS/SCSS lint tooling entirely — the project ships no `.css`/`.scss`
  source files, so Stylelint had nothing to lint.
- Updated all related `package.json` scripts to call Biome instead of the old tools.
- Ran `biome check --write .` once across the repo to apply the new formatting
  baseline (whitespace, quotes, trailing commas, import order). No runtime logic
  was changed by this pass.
- Fixed a Stage 01 regression: `rimraf` and `del` were referenced in scripts but
  missing from `devDependencies` (the addition from Stage 01 was lost before that
  commit). Re-added them here since the build pipeline now reaches that step.

---

## Tooling replaced

| Old | New |
|---|---|
| `eslint@7.32.0` + ~25 eslint plugins/configs | `@biomejs/biome@2.5.0` |
| `prettier@2.8.8` + `eslint-plugin-prettier` | Biome formatter |
| `stylelint@13` + 6 stylelint plugins/configs | removed (no CSS/SCSS in `src/`) |
| `cross-env` (only used to set `LINT=true` for eslint) | removed (no longer needed) |
| `.eslintrc.js`, `.eslintignore` | `biome.json` |
| `.prettierrc`, `.prettierignore` | `biome.json` |
| `.stylelintrc.json` | removed |

`biome.json` was generated using `biome init`, then populated using
`biome migrate prettier --write` and `biome migrate eslint --write`, which
auto-converted ~57% of the old ESLint ruleset directly. The remainder of the
ruleset was reviewed and re-added manually where a Biome equivalent exists.

### Notable manual config decisions

- `javascript.jsxRuntime: "reactClassic"` — `tsconfig.base.json` uses
  `"jsx": "react"` (the classic transform), which means `import React from 'react'`
  is required in every file that uses JSX. Without this setting, Biome's
  `noUnusedImports` rule does not know that JSX implicitly uses `React` under the
  classic transform, and incorrectly flags (and would unsafely remove) those
  imports. Setting `jsxRuntime: "reactClassic"` fixes this.
- Test files (`*.test.*`, `*.spec.*`, `**/tests/**`, `**/__TESTS__/**`) get an
  override that declares Jest globals (`describe`, `it`, `test`, `expect`,
  `beforeEach`, `afterEach`, `beforeAll`, `afterAll`, `jest`) — without this,
  `noUndeclaredVariables` produced ~600 false-positive errors across every spec
  file.
- `vcs.useIgnoreFile: true` — Biome respects `.gitignore`, so a separate
  Biome-specific ignore file was not added.

---

## package.json script changes

| Script | Before | After |
|---|---|---|
| `lint:js` | `cross-env LINT=true eslint src/**/*.{ts,tsx} --fix` | `biome lint --write .` |
| `generate:ts-config` | `... && prettier --write tsconfig.json` | `... && biome format --write tsconfig.json` |
| `prebuild` | `... && npm run lint:js` | `... && npm run check` |
| `pre-commit` | `npm run lint:js && npm run test` | `npm run check && npm run test` |
| _(new)_ `format` | — | `biome format --write .` |
| _(new)_ `format:check` | — | `biome format .` |
| _(new)_ `lint` | — | `biome lint .` |
| _(new)_ `lint:fix` | — | `biome lint --write .` |
| _(new)_ `check` | — | `biome check .` |
| _(new)_ `check:fix` | — | `biome check --write .` |

`lint-staged` config updated from separate eslint/prettier/stylelint globs to a
single Biome pattern covering `*.{js,jsx,ts,tsx,json,md}`.

The `husky` `pre-commit` hook (`npm run pre-commit`) was already package-manager
neutral from Stage 01 and required no further change.

---

## Stage 01 regression fix: rimraf / del

`rimraf` and `del` were added to `devDependencies` in Stage 01 to support
`delete:dist` and `delete:sourcemaps` (no longer hoisted automatically by pnpm
the way Yarn v1 hoisted them). That addition did not make it into the Stage 01
commit (`74082bb`) — confirmed by inspecting `origin/master:package.json`, which
has the `rimraf dist` / `del dist/**/*.js.map` script lines but no corresponding
`devDependencies` entries.

This was not caught in Stage 01 because `pnpm run build` failed earlier in the
pipeline (at the ESLint 7 / Node 24 crash), before ever reaching `delete:dist`.
Now that lint passes via Biome, the build pipeline reaches `delete:dist` and the
missing dependency became visible. Re-added both packages here.

---

## Local checks (Node 24.15.0 / Windows / pnpm 10.32.1)

### `pnpm run check` (biome check, no write)
✅ **0 errors**, 29 warnings (see "Remaining warnings" below).

### `pnpm run lint`
✅ **0 errors**. Exit code 0.

### `pnpm run format:check`
✅ **0 errors**. Exit code 0.

### `pnpm run lint:js` (legacy script name, now points to Biome)
✅ **0 errors**. Exit code 0.

### `pnpm run build`
⚠️ **Progress, but still fails** — at a different, later, and unrelated step.

- `prebuild` (`generate:ts-config && delete:dist && check`) — ✅ now passes
  (previously failed at the ESLint 7 crash in Stage 01).
- `rollup:compile` — ❌ fails: `Error: Unexpected token` in
  `rollup-plugin-typescript2` while parsing `src/components/PieDonutChart.tsx`.
  This is a Rollup 2 / `rollup-plugin-typescript2` / TypeScript parser
  incompatibility, unrelated to linting or formatting. **Out of scope for this
  PR** — left for a future build-tooling modernization stage.

### `pnpm run test`
⚠️ Same pre-existing failure as documented in Stage 01, unchanged by this PR:
`consoleErrorMocked` mock assertions fail under Node 24 / current jsdom in
`checkPropsErrors.spec.ts` and a few resize-handler specs. Not caused by the
Biome migration.

---

## Remaining warnings (29, non-blocking)

Intentionally left as warnings rather than fixed in this PR, to keep this PR
scoped to tooling migration rather than behavior-adjacent code changes:

| Rule | Count | Notes |
|---|---|---|
| `lint/suspicious/useIterableCallbackReturn` | 12 | Stylistic; would need per-callsite review |
| `lint/correctness/useExhaustiveDependencies` | 3 | React hook dependency arrays; needs behavioral review per hook |
| `lint/suspicious/noConsole` | 8 | Mostly intentional `console.error` calls in prop-validation code and test mocks |
| `lint/style/useConsistentBuiltinInstantiation` | 3 | `Array(n)` vs `new Array(n)`; safe but left for a follow-up |
| `lint/complexity/useLiteralKeys` | 2 | Minor |
| `lint/correctness/noUnusedVariables` | 1 | Minor |

None of these affect `pnpm run check`'s exit code (warnings don't fail the
command); `pnpm run lint` and `pnpm run check` both exit 0.

---

## What was NOT done in this PR

- No fix for the `rollup-plugin-typescript2` build failure (separate, unrelated
  tooling issue — left for a build-modernization PR).
- No fix for the pre-existing Jest/Node 24 test failures.
- No change to babel/rollup/jest *logic* — only whitespace/formatting passes
  from `biome check --write .` touched these config files.
- No CI re-enablement (still intentionally paused from Stage 01).
- The 29 remaining lint warnings were not auto-fixed or manually resolved.
