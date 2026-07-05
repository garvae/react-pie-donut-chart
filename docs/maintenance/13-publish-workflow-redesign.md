# Stage 13 — Publish workflow redesign

## Summary

- Replaced the disabled no-op publish workflow with a manual `workflow_dispatch` release workflow.
- Added `dry_run=true` as the safe default — no publish happens unless explicitly changed.
- Added `scripts/verify-npm-version-not-published.js` to block duplicate publishes.
- Added `docs/release-checklist.md` with a practical operator guide.
- Switched npm publishing to Trusted Publishing through GitHub OIDC.
- Kept the dispatch manual while automating the release PR, tag, npm publish, GitHub Release, and follow-up sync after dispatch.

---

## Publish workflow

| Field | Value |
|---|---|
| File | `.github/workflows/publish.yml` |
| Trigger | `workflow_dispatch` only |
| Default mode | `dry_run=true` (safe — no publish) |
| Required branch | `refs/heads/main` (enforced via `if:` guard) |
| Node version | 24 |
| Commands | `pnpm install --frozen-lockfile` → version prepare → `pnpm run check:all` → `pnpm audit` → version preflight → tarball pack → optional real publish |
| npm auth | Trusted Publishing via GitHub OIDC (`id-token: write`) |
| Provenance | `npm publish --provenance` on real publish (`dry_run=false`) |
| Dist-tag support | `latest` (default) or `next` |
| Publish payload | Exact tarball built from `./dist` and uploaded as a workflow artifact |
| Release sync | Real runs create the release PR, merge it after checks, tag the merge commit, publish to npm, and create the GitHub Release |

---

## Safety guards

| Guard | Status |
|---|---|
| No publish on `pull_request` | ✅ `workflow_dispatch` only |
| No publish on `push` to `main` | ✅ `workflow_dispatch` only |
| Branch guard | ✅ `if: github.ref == 'refs/heads/main'` |
| Version already published check | ✅ `scripts/verify-npm-version-not-published.js` exits 1 if duplicate |
| `dry_run=true` default | ✅ Safe by default — runs all gates but skips actual publish |
| `dry_run=false` manual only | ✅ Requires explicit owner action in GitHub Actions UI |
| Package smoke test before publish | ✅ included in `pnpm run check:all` |
| No stored npm registry secret | ✅ Trusted Publishing via GitHub OIDC |
| Concurrency | ✅ `cancel-in-progress: false` — a mid-flight publish is never cancelled |
| GitHub Release asset | ✅ same tarball is attached to the release |

---

## Release checklist

- File: `docs/release-checklist.md`
- Main steps: pre-release checks → dry-run workflow → real release dispatch → post-release verification

---

## Local checks (results at time of PR)

| Command | Result |
|---|---|
| `pnpm install` | ✅ pass |
| `pnpm run check:all` | ✅ pass (197 tests, 0 failures; 37 biome warnings are pre-existing) |
| `pnpm audit` | ✅ no known vulnerabilities |
| `node scripts/verify-npm-version-not-published.js` | ✅ exits 0 — `1.0.3` is not yet published on the public npm registry. Safe to publish when ready. |

---

## Workflow behavior on real runs

1. The owner manually dispatches **Release** from `main`.
2. The workflow calculates the next version from dispatch inputs and updates `package.json`.
3. Full validation runs against that version and the exact release tarball is built.
4. The workflow opens `release/vX.Y.Z`, waits for CI, merges the PR, tags the merge commit, publishes to npm, and creates the GitHub Release.
5. The push to `main` also keeps downstream automation such as the demo Pages workflow in sync.
