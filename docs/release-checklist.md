# Release checklist

## Before release

- [ ] Merge all intended PRs into `master`.
- [ ] Confirm CI is green on `master`.
- [ ] Confirm `pnpm run check:all` passes locally.
- [ ] Confirm `pnpm audit` is clean.
- [ ] Confirm README examples match the public API.
- [ ] Decide version bump: patch / minor / major.
- [ ] Update `package.json` version field.
- [ ] Update release notes / changelog draft.
- [ ] Run `pnpm run build` to regenerate `dist/` (version in `dist/package.json` is updated by `postbuild`).
- [ ] Run `pnpm run pack:smoke` to verify the tarball locally.
- [ ] Check package contents with `npm pack --dry-run` or the publish workflow dry-run.
- [ ] Confirm `dist/package.json` has the correct `name`, `version`, `main`, `module`, `typings`, and `publishConfig`.

## Dry run

- [ ] Run the GitHub Actions **Publish** workflow with `dry_run=true` (the default).
- [ ] Confirm dry-run output shows the expected tarball contents.
- [ ] Confirm the version preflight reports "not yet published".
- [ ] Confirm the full quality gate passes inside the workflow.

## Publish

- [ ] Run the GitHub Actions **Publish** workflow with `dry_run=false`.
- [ ] Use `npm_tag=latest` for a stable release or `npm_tag=next` for a prerelease.
- [ ] Confirm the npm package page shows the new version.
- [ ] Create a GitHub Release with release notes if desired.
- [ ] Verify installation in a throwaway project:
      `npm install @garvae/react-pie-donut-chart@<version>`

## After release

- [ ] Announce the release if applicable.
- [ ] Update any linked documentation or demo sites.
- [ ] Open next development cycle (version bump to `-next` or similar if using prereleases).

---

> Publishing is **always manual**.
> See [`docs/maintenance/13-publish-workflow-redesign.md`](maintenance/13-publish-workflow-redesign.md)
> for the full publish workflow design and safety guards.
