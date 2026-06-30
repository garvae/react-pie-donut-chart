# Stage 12 — Restore CI

## Summary

- Restored validation-only GitHub Actions CI.
- CI runs on pull requests and pushes to `main`.
- CI uses pnpm and the canonical local `check:all` gate.
- CI runs dependency audit.
- Publish remains disabled/no-op.

## CI behavior

- Events: `pull_request` and `push` to `main` only (not all branches).
- Node versions: 22 (LTS) and 24 (current development baseline), matrix strategy.
- Package manager: pnpm via Corepack.
- Commands: `pnpm install --frozen-lockfile`, `pnpm run check:all`, `pnpm audit`.
- Permissions: `contents: read` only.
- Concurrency: `cancel-in-progress: true` per workflow+ref group.

## Publish safety

- Publish workflow status: disabled/no-op (`workflow_dispatch` only, echoes a message).
- NPM token usage: none in any workflow file.
- Automatic publish on merge: no.
- Automatic publish on tag/release: no.

## Why this CI shape

- Ubuntu only: Windows/macOS matrix skipped to preserve Actions minutes; Windows coverage already provided by local agent runs throughout the audit.
- Node 22/24 matrix: Node 24 is the active dev baseline; Node 22 provides LTS compatibility signal.
- `check:all` alignment with local development: CI runs exactly what the developer runs locally — no divergence between local and remote gate.
- No release/publish in this PR: publish workflow redesign is deferred to a separate stage.

## Local checks

- `pnpm install`: passed.
- `pnpm run check:all`: passed (60 suites, 197 tests, build + types + lint + coverage + smoke + size-limit).
- `pnpm audit`: 0 vulnerabilities.

## Known issues left for later PRs

- Publish workflow remains no-op.
- Release checklist remains for later.
- npm publish/provenance/tag strategy remains for later.
