# Demo app

This app is the in-repo consumer sandbox for `@garvae/react-pie-donut-chart`.

## Purpose

- test the package exactly as it is built in `dist/`
- keep a shareable demo page ready for GitHub Pages
- provide realistic usage examples, prop references, and accessibility guidance

## How it consumes the package

`demo/package.json` depends on:

```json
"@garvae/react-pie-donut-chart": "link:../dist"
```

That means the demo imports the locally built package output instead of the source files.
If the package build changes, rebuild `dist/` and the demo will consume the updated output.

## Local workflow

From the repository root:

```sh
pnpm run demo:install
pnpm run demo:dev
```

Recommended two-terminal loop when iterating on the library:

```sh
pnpm run build:watch
pnpm run demo:dev
```

## GitHub Pages

The demo is built by `.github/workflows/demo-pages.yml`.

- Pull requests validate the demo build.
- Pushes to `main` deploy the same build to GitHub Pages.
- Real releases stay in sync because the release workflow merges back into `main`.
