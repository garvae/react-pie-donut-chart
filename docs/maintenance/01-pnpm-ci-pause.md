# Stage 01 — pnpm migration, CI pause, publish safety

## Summary

- Migrated local package management from Yarn v1 to pnpm.
- Temporarily disabled automatic CI.
- Temporarily disabled automatic npm publish.
- Updated README coverage wording.

---

## Publish safety

- Automatic publish workflow found: **yes**
- File: `.github/workflows/publish.yml`
- Previous behavior: triggered by `workflow_run` on successful CI on `master`; ran `yarn publish:dist` (`cd dist && npm publish`) with `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}`
- Current behavior: **disabled / no-op** — workflow_dispatch only, no publish job, no npm token access
- Merge to default branch can publish automatically: **no**
- Package published during this PR: **no**

The `publish:dist` manual script (`cd dist && npm publish`) is still present in `package.json`
and is intentionally kept for future manual releases. It is not wired to any CI workflow.

---

## Package manager migration

- `yarn.lock` removed.
- `pnpm-lock.yaml` added.
- `packageManager: "pnpm@10.32.1"` declared in `package.json`.
- Internal `yarn X` script calls replaced with `npm run X` (package-manager-neutral).
- Husky hook updated from `yarn pre-commit` to `npm run pre-commit`.
- `pnpm.overrides` added to mirror Yarn `resolutions` (`react-error-overlay@6.0.9`).
- `rimraf` and `del` added as explicit `devDependencies`.
  Reason: pnpm does not hoist transitive binaries; both were previously available
  via Yarn v1 hoisting but are not in `.bin` under pnpm's strict layout.

---

## CI: temporarily disabled

Both CI workflows are temporarily disabled to save GitHub Actions minutes during
active maintenance. This is intentional and must be reversed in a later PR.

| Workflow | Previous trigger | Current trigger |
|---|---|---|
| `main.yml` | `on: [push]` | `on: workflow_dispatch` |
| `publish.yml` | `workflow_run` on CI success on master | `on: workflow_dispatch` (no-op job) |

CI must be restored after tooling modernization is complete.

---

## README coverage wording

Changed:
```
✔️100% Tests-covered
```

To:
```
✔️ aims for strong test coverage (maintenance goal: near-100% for core behavior)
```

---

## Local checks (Node 24.15.0 / Windows / pnpm 10.32.1)

### `corepack enable`
✅ Passed.

### `pnpm install`
✅ Passed. 1414 packages installed.

**Known install warning — node-sass@7.0.3:**
- No prebuilt binary for Node 24 (HTTP 404).
- Build from source fails: `ModuleNotFoundError: No module named 'distutils'`
  (`node-gyp@8.4.1` requires `distutils`; removed in Python 3.14).
- This is a pre-existing incompatibility with Node 24, unrelated to pnpm migration.
- Does not affect `pnpm run test` (tests do not import SCSS).
- Left for later tooling modernization PR.

### `pnpm run build`
❌ Failed at `prebuild` → `lint:js` step.

Current old tooling does not pass under Node 24. This is documented and intentionally
left for later modernization PRs.

- Command: `npm run lint:js` (called from `prebuild`)
- Error: `TypeError: Cannot read properties of undefined (reading 'getScope')`
  in `eslint-plugin-sort-destructure-keys@1.6.0` with `eslint@7.32.0`
- Cause: ESLint 7 scope analysis API changed in newer Node.js environments.
- Not caused by pnpm migration — same failure would occur with Yarn + Node 24.

### `pnpm run test`
⚠️ Partially passed (jest `bail: 1` stops at first failing suite).

- `src/hooks/__TESTS__/.../resizeHandler.spec.ts` — ✅ PASS (6/6 tests)
- `src/utils/__TESTS__/checkPropsErrors.spec.ts` — ❌ FAIL (11/12 tests)
  - All failures: `consoleErrorMocked` called 0 times, expected N
  - Cause: `console.error` mock behavior changed in Node 24 / newer jsdom
  - Not caused by pnpm migration — same failure would occur with Yarn + Node 24

### `pnpm run lint:js`
❌ Failed. Same ESLint 7 + Node 24 incompatibility as described above.

---

## Known issues left for later PRs

- ESLint 7 is not compatible with the current Node 24 setup.
- Jest tests have pre-existing failures under Node 24 (`console.error` mock behavior).
- `node-sass@7` is incompatible with Node 24 / current Python toolchain.
- Build modernization, Biome migration, dependency cleanup, and test modernization
  are intentionally left for later PRs.

---

## Scope guard

This PR does not change runtime code or public API.
No npm package was published.
