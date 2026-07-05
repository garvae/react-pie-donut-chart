#!/usr/bin/env node
/**
 * Package smoke test.
 *
 * Builds a real npm tarball of this package and installs it into three
 * throwaway "consumer" projects (CJS, ESM, TypeScript) to verify the
 * published package actually works the way a real consumer would use it —
 * something `pnpm run test`/`pnpm run build` alone cannot catch, since both
 * only ever exercise the package from inside its own source tree, never as
 * an installed dependency resolved through `node_modules`.
 *
 * This script does NOT publish anything. It only creates a local tarball via
 * `npm pack` and installs that tarball (via a `file:` reference) into
 * temporary consumer projects under `.tmp/package-smoke`, which are deleted
 * before and after every run.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const TMP_DIR = path.join(ROOT, '.tmp', 'package-smoke');
const CJS_DIR = path.join(TMP_DIR, 'cjs-consumer');
const ESM_DIR = path.join(TMP_DIR, 'esm-consumer');
const TS_DIR = path.join(TMP_DIR, 'ts-consumer');

const PKG_JSON = require(path.join(ROOT, 'package.json'));

const SAMPLE_DATA = [
  { color: '#287BC8', id: '001', order: 1, value: 10 },
  { color: '#D64045', id: '002', order: 2, value: 40 }
];

let step = 0;
const log = (msg) => {
  step += 1;
  process.stdout.write(`\n[pack:smoke] ${step}. ${msg}\n`);
};
const fail = (msg) => {
  process.stderr.write(`\n[pack:smoke] FAILED: ${msg}\n`);
  process.exit(1);
};
const run = (cmd, args, cwd) => {
  if (process.platform === 'win32') {
    return execFileSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', cmd, ...args], {
      cwd,
      stdio: ['ignore', 'pipe', 'inherit'],
      encoding: 'utf8'
    });
  }

  return execFileSync(cmd, args, {
    cwd,
    stdio: ['ignore', 'pipe', 'inherit'],
    encoding: 'utf8'
  });
};

// ---------------------------------------------------------------------------
// 1. Clean up any leftover temp directories from a previous (interrupted) run
// ---------------------------------------------------------------------------
log('Cleaning up old temp directories');
fs.rmSync(TMP_DIR, { recursive: true, force: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// 2. Make sure dist/ exists (build if it doesn't)
// ---------------------------------------------------------------------------
log('Verifying dist/ exists (building if necessary)');
const distIndexJs = path.join(ROOT, 'dist', 'index.js');
if (!fs.existsSync(distIndexJs)) {
  run('npm', ['run', 'build'], ROOT);
}
if (!fs.existsSync(distIndexJs)) {
  fail('dist/index.js is still missing after build');
}

// ---------------------------------------------------------------------------
// 3 + 9a. npm pack, and verify the tarball's reported file list
// ---------------------------------------------------------------------------
log('Packing tarball with npm pack');
// --ignore-scripts: dist/ is already built above; the flag is a best-effort hint
// to suppress lifecycle/Husky output before the --json payload, but npm 10 (Node 22)
// still runs the package's own `prepare` script regardless.  To stay resilient we
// also slice stdout from the first '[' so any leading text (e.g. Husky's skip-message)
// is discarded before JSON.parse, keeping the script stable across npm versions.
const packJsonRaw = run('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', TMP_DIR], ROOT);
const jsonStart = packJsonRaw.indexOf('[');
if (jsonStart === -1) {
  fail('npm pack --json produced no parseable JSON array in stdout');
}
const packInfo = JSON.parse(packJsonRaw.slice(jsonStart))[0];
const tarballPath = path.join(TMP_DIR, packInfo.filename);

if (!fs.existsSync(tarballPath)) {
  fail(`tarball not found at expected path: ${tarballPath}`);
}

const packedFiles = packInfo.files.map((f) => f.path);
const expectedInTarball = [
  'dist/index.js',
  'dist/react-pie-donut-chart.esm.js',
  'dist/index.d.ts',
  'dist/package.json'
];
const missingFromTarball = expectedInTarball.filter((f) => !packedFiles.includes(f));
if (missingFromTarball.length > 0) {
  fail(`tarball is missing expected files: ${missingFromTarball.join(', ')}`);
}
process.stdout.write(`   tarball contains ${packedFiles.length} files, including all expected dist/ entries\n`);

// ---------------------------------------------------------------------------
// 10. React must be a peer dependency, never bundled
// ---------------------------------------------------------------------------
log('Verifying React is a peer dependency, not bundled');
if (PKG_JSON.dependencies && Object.keys(PKG_JSON.dependencies).length > 0) {
  fail(`expected an empty "dependencies" field, found: ${Object.keys(PKG_JSON.dependencies).join(', ')}`);
}
if (!PKG_JSON.peerDependencies || !PKG_JSON.peerDependencies.react) {
  fail('expected "react" to be declared in peerDependencies');
}
const cjsBundleSource = fs.readFileSync(distIndexJs, 'utf8');
if (!cjsBundleSource.includes("require('react')") && !cjsBundleSource.includes('require("react")')) {
  fail('dist/index.js does not externalize react via require("react") — it may have been bundled in');
}
process.stdout.write('   react is declared as a peerDependency and externalized (require("react")) in the CJS build\n');

// ---------------------------------------------------------------------------
// Shared helper: scaffold a minimal consumer project that depends on the
// tarball via a file: reference, plus react/react-dom as its own explicit
// dependencies (proving the consumer must supply React itself).
// ---------------------------------------------------------------------------
function scaffoldConsumer(dir, extraPackageJson) {
  fs.mkdirSync(dir, { recursive: true });
  const consumerPackageJson = {
    name: path.basename(dir),
    version: '0.0.0',
    private: true,
    dependencies: {
      [PKG_JSON.name]: `file:${tarballPath}`,
      react: '^18.2.0',
      'react-dom': '^18.2.0'
    },
    ...extraPackageJson
  };
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(consumerPackageJson, null, 2));
  // --ignore-scripts: the installed tarball still has its own "postinstall":
  // "husky install" lifecycle script, which would otherwise try (and fail) to
  // run against a non-existent .git directory inside this throwaway consumer.
  run('npm', ['install', '--no-audit', '--no-fund', '--ignore-scripts', '--loglevel=error'], dir);
}

// ---------------------------------------------------------------------------
// 6. CJS consumer
// ---------------------------------------------------------------------------
log('Verifying CJS consumer (require + react-dom/server)');
scaffoldConsumer(CJS_DIR);
const cjsScript = `
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const PieDonutChart = require('${PKG_JSON.name}');
const Chart = PieDonutChart.default || PieDonutChart;
const html = renderToStaticMarkup(React.createElement(Chart, { data: ${JSON.stringify(SAMPLE_DATA)}, size: 200 }));
if (!html || !html.includes('<svg')) {
  console.error('NO_SVG_FOUND');
  console.error(html);
  process.exit(1);
}
console.log('CJS_OK');
`;
fs.writeFileSync(path.join(CJS_DIR, 'consumer.js'), cjsScript);
const cjsOutput = run('node', ['consumer.js'], CJS_DIR);
if (!cjsOutput.includes('CJS_OK')) {
  fail('CJS consumer did not render an <svg> as expected');
}
process.stdout.write('   CJS consumer rendered a real <svg> via require()\n');

// ---------------------------------------------------------------------------
// 7. ESM consumer
// ---------------------------------------------------------------------------
log('Verifying ESM consumer (native import + react-dom/server)');
scaffoldConsumer(ESM_DIR, { type: 'module' });
const esmScript = `
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PieDonutChart from '${PKG_JSON.name}';
const html = renderToStaticMarkup(React.createElement(PieDonutChart, { data: ${JSON.stringify(SAMPLE_DATA)}, size: 200 }));
if (!html || !html.includes('<svg')) {
  console.error('NO_SVG_FOUND');
  console.error(html);
  process.exit(1);
}
console.log('ESM_OK');
`;
fs.writeFileSync(path.join(ESM_DIR, 'consumer.mjs'), esmScript);
const esmOutput = run('node', ['consumer.mjs'], ESM_DIR);
if (!esmOutput.includes('ESM_OK')) {
  fail('ESM consumer did not render an <svg> as expected');
}
process.stdout.write('   ESM consumer rendered a real <svg> via native import\n');

// ---------------------------------------------------------------------------
// 8. TypeScript consumer
// ---------------------------------------------------------------------------
log('Verifying TypeScript consumer (types resolve + tsc --noEmit)');
scaffoldConsumer(TS_DIR, {
  devDependencies: {
    typescript: PKG_JSON.devDependencies.typescript,
    '@types/react': PKG_JSON.devDependencies['@types/react']
  }
});
const tsScript = `
import React from 'react';
import PieDonutChart, { DataItem } from '${PKG_JSON.name}';

const data: DataItem[] = ${JSON.stringify(SAMPLE_DATA)};

const App = () => React.createElement(PieDonutChart, { data, size: 200 });

export default App;
`;
fs.writeFileSync(path.join(TS_DIR, 'index.tsx'), tsScript);
fs.writeFileSync(
  path.join(TS_DIR, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        target: 'es2017',
        module: 'commonjs',
        jsx: 'react',
        moduleResolution: 'node',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: false,
        noEmit: true
      },
      include: ['index.tsx']
    },
    null,
    2
  )
);
run('npx', ['tsc', '--noEmit'], TS_DIR);
process.stdout.write(
  '   TypeScript consumer compiled cleanly against the published types (strict, skipLibCheck: false)\n'
);

// ---------------------------------------------------------------------------
// Clean up
// ---------------------------------------------------------------------------
log('Cleaning up temp directories and tarball');
fs.rmSync(TMP_DIR, { recursive: true, force: true });

process.stdout.write('\n[pack:smoke] All package smoke tests passed.\n\n');
