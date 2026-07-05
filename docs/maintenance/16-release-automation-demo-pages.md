# Stage 16 — Trusted publishing automation and demo site

## Summary

- Removed repository-level npm registry credential wiring and switched release publishing to npm Trusted Publishing.
- Expanded the manual release workflow into a one-click automation flow after dispatch.
- Added a first-class `demo/` consumer app that installs the locally built package from `dist/`.
- Added a GitHub Pages workflow so the demo site can stay synced with `main` and with future releases.

## Release automation

### Trusted Publishing

- `.npmrc` was removed from the repository.
- `.github/workflows/publish.yml` now relies on GitHub OIDC (`id-token: write`) plus npm Trusted Publishing.
- Real publishes use `npm publish <tarball> --provenance`, so npm receives provenance from the workflow identity instead of a stored registry credential.

### One-click flow after manual dispatch

The **Release** workflow is still started manually, but once dispatched it now:

1. Calculates the next version from workflow inputs.
2. Runs `pnpm run check:all` and `pnpm audit`.
3. Verifies that the target version is not already published on the public npm registry.
4. Packs the exact `dist/` tarball and uploads it as a workflow artifact.
5. On `dry_run=false`, creates `release/vX.Y.Z`, waits for PR checks, merges it, creates the git tag, publishes to npm, and creates the GitHub Release.

This keeps the operator step intentionally small while removing manual tag/release drift.

## Demo application

- `demo/` is a standalone Vite + React app.
- The demo depends on `@garvae/react-pie-donut-chart` via `link:../dist`, so it consumes the same build output that will be published.
- The UI uses Mantine with `defaultColorScheme="auto"` for automatic light/dark support.
- The page includes:
  - multiple chart usage variants
  - a responsive `parentRef` example
  - a controlled-selection example
  - prop reference tables
  - local test commands and release notes

## Demo and Pages sync

- `.github/workflows/demo-pages.yml` builds the demo on pull requests and on `main`.
- On pushes to `main` or manual workflow dispatches from `main`, the same workflow deploys `demo/dist` to GitHub Pages.
- Because the release workflow merges a release PR into `main`, a real release automatically keeps the live demo in sync without extra operator steps.

## New local commands

From the repository root:

- `pnpm run demo:install`
- `pnpm run demo:dev`
- `pnpm run build:watch`
- `pnpm run demo:build`
- `pnpm run demo:preview`

## Secrets impact

- `docs/secrets/SECRET_CATALOG.md` now records that npm publishing no longer requires a repository-stored registry credential.
- Publishing relies on GitHub's short-lived workflow identity and npm's Trusted Publisher binding for this repository/workflow pair.
