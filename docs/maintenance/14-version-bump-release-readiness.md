# Stage 14 — Version bump and release readiness

## Goal

Prepare the first release after the maintenance modernisation pass (Stages 01–13).

## Changes

### Version bump

- Root `package.json` bumped from `1.0.3` → `1.1.0` using `pnpm version 1.1.0 --no-git-tag-version`.
- No git tag was created.
- `dist/package.json` is regenerated on every build via `postbuild → generate:packagejson`; it received `1.1.0` automatically.

### Rationale for 1.1.0

The maintenance included:
- New optional accessibility props (`ariaLabel`, `getSegmentAriaLabel`) — backward-compatible feature additions.
- Numerous bugfixes across geometry, SSR, resize cleanup, and data handling.
- No breaking public API changes.

`1.1.0` (minor bump) is the correct semver choice: new backward-compatible features.

### dist/package.json files field fix

The root `package.json` has `"files": ["*.d.ts", "dist"]`, which is correct when publishing
from the repository root (the `dist/` directory is a subdirectory there). When this same
field was copied verbatim into `dist/package.json` and `npm publish ./dist` was run, npm
interpreted `dist` as a subdirectory of `./dist` (which does not exist), causing
`react-pie-donut-chart.esm.js` to be silently excluded from the published tarball.

Fix: `scripts/generate-package-json.js` now overrides the `files` field in the generated
`dist/package.json` with `["*.js", "*.d.ts"]`, which correctly matches all JS build
artefacts and type declarations at the dist root.

The pack:smoke test was not catching this because it packs from the repository root (where
`dist/` is a real subdirectory) rather than from `./dist` directly.

### Release notes

Created `docs/releases/1.1.0.md` with a summary of all changes since the last published version.

### README update

Added a single-line note pointing to the release notes file.

### Release checklist updates

Added:
- Explicit `--no-git-tag-version` instruction for version bump.
- Step to verify version is not yet published.
- Explicit rule: only publish after the release PR is merged to `main`.

## Local checks performed

- `pnpm run check:all` — 197/197 tests, 99.57% coverage, pack:smoke all passed, size OK.
- `pnpm audit` — no vulnerabilities.
- `node scripts/verify-npm-version-not-published.js` — 1.1.0 not yet published.
- `npm pack ./dist --dry-run` — tarball shows 6 files including ESM.

## Publish status

- Package published: no
- Git tag created: no
- GitHub Release created: no
- Publish workflow dispatched: no

## Next steps after merge

1. Confirm validation CI passes on the merged `main`.
2. Run GitHub Actions → **Publish** → `dry_run=true`, `npm_tag=latest`.
3. Verify dry-run output shows the correct 6-file tarball with version `1.1.0`.
4. If dry-run passes: run with `dry_run=false` to publish.
