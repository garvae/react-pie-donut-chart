# Stage 15 — Audit follow-ups and repository hardening

## Summary

- Removed two avoidable O(n²) / unstable-render hotspots found during the post-maintenance audit.
- Prepared repository docs and workflows for the `master` → `main` default-branch migration.
- Added missing repository hygiene files: `.gitattributes` and `docs/secrets/SECRET_CATALOG.md`.

## Code improvements

### Resize handling stability

- `src/hooks/helpers/useHandleResize/useHandleResize.ts`
- The debounced resize callback is now memoized instead of being recreated on every render.
- Pending resize timers are now cancelled on cleanup to avoid orphaned delayed updates.
- Size equality checks now read from a ref, so the resize listener does not churn purely because internal size state changed.

Impact:
- Fewer listener/observer re-creations during responsive resizing.
- Less unnecessary work during repeated chart layout updates.
- Safer unmount behavior when a debounced resize is still pending.

### Data remap duplicate detection

- `src/hooks/useChartDataRemap.ts`
- Duplicate `id` / `order` detection now uses precomputed counters instead of `filter(...)` inside `map(...)`.

Impact:
- Duplicate detection is now O(n) instead of O(n²).
- Public behavior and warning texts stay unchanged.

## Repository follow-ups

- `.github/workflows/main.yml` now validates pushes to `main`.
- `.github/workflows/publish.yml` now only allows publish dispatches from `main`.
- README and release docs now reference `main`.
- Removed a broken README link to a non-existent `CONTRIBUTING.md`.

## GitHub settings to verify/apply

- Set the default branch to `main`.
- Enable branch protection on `main` with required CI checks.
- Enable automatic branch deletion after merge.
- Keep publish manual-only.

## Validation target

Run:

- `corepack pnpm run check:all`
- `corepack pnpm audit`

## Automation note

- The repository pins `pnpm@10.32.1` via `packageManager`.
- Automation and CI should prefer `corepack pnpm ...` so the pinned version is used consistently.
