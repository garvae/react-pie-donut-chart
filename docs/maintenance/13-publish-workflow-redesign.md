# Stage 13 — Publish workflow redesign

## Summary

- Replaced the disabled no-op publish workflow with a manual `workflow_dispatch` publish workflow.
- Added `dry_run=true` as the safe default — no publish happens unless explicitly changed.
- Added `scripts/verify-npm-version-not-published.js` to block duplicate publishes.
- Added `docs/release-checklist.md` with a practical step-by-step release guide.
- Kept actual publishing fully manual and guarded behind explicit owner dispatch.
- Did **not** publish the package in this PR.

---

## Publish workflow

| Field | Value |
|---|---|
| File | `.github/workflows/publish.yml` |
| Trigger | `workflow_dispatch` only |
| Default mode | `dry_run=true` (safe — no publish) |
| Required branch | `refs/heads/master` (enforced via `if:` guard) |
| Node version | 24 |
| Commands | `pnpm install --frozen-lockfile` → `pnpm run check:all` → `pnpm audit` → `pnpm run pack:smoke` → version preflight → publish |
| NPM token source | `secrets.NPM_TOKEN` (GitHub secret, never hardcoded) |
| Provenance | `--provenance` on real publish (`dry_run=false`) |
| Dist-tag support | `latest` (default) or `next` |
| Publish directory | `./dist` (mirrors `publish:dist` script: `cd dist && npm publish`) |

---

## Safety guards

| Guard | Status |
|---|---|
| No publish on `pull_request` | ✅ `workflow_dispatch` only |
| No publish on `push` to `master` | ✅ `workflow_dispatch` only |
| Branch guard | ✅ `if: github.ref == 'refs/heads/master'` |
| Version already published check | ✅ `scripts/verify-npm-version-not-published.js` exits 1 if duplicate |
| `dry_run=true` default | ✅ Safe by default — runs all gates but skips actual publish |
| `dry_run=false` manual only | ✅ Requires explicit owner action in GitHub Actions UI |
| Package smoke test before publish | ✅ `pnpm run pack:smoke` runs in both dry-run and real publish |
| No hardcoded npm token | ✅ `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` only |
| Concurrency | ✅ `cancel-in-progress: false` — a mid-flight publish is never cancelled |

---

## Release checklist

- File: `docs/release-checklist.md`
- Main steps: pre-release checks → local build → dry-run workflow → real publish → post-release verification

---

## Local checks (results at time of PR)

| Command | Result |
|---|---|
| `pnpm install` | ✅ pass |
| `pnpm run check:all` | ✅ pass (197 tests, 0 failures; 37 biome warnings are pre-existing) |
| `pnpm audit` | ✅ no known vulnerabilities |
| `pnpm run pack:smoke` | ✅ pass |
| `node scripts/verify-npm-version-not-published.js` | ✅ exits 0 — `1.0.3` is not yet published on the public npm registry. Safe to publish when ready. |

---

## Known issues left for later PRs

- Actual version bump is a separate release PR decision for the owner.
- GitHub Release automation (tagging, release notes) is optional future work.
- The 37 biome warnings are pre-existing and tracked separately from this PR.
