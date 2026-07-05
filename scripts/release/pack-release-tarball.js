#!/usr/bin/env node
'use strict';

/**
 * Creates a release tarball from `dist/` and validates the published file set.
 * The resulting tarball path is printed and exported through `GITHUB_OUTPUT`
 * when the script runs inside GitHub Actions.
 */

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const DIST = path.join(ROOT, 'dist');
const OUT_DIR = path.join(ROOT, '.tmp', 'release-artifacts');
const EXPECTED_FILES = [
  'index.js',
  'react-pie-donut-chart.esm.js',
  'index.d.ts',
  'package.json',
  'README.md',
  'LICENSE'
];
/**
 * Run a command and return stdout as text.
 * @param {string} command
 * @param {string[]} args
 * @returns {string}
 */
function run(command, args) {
  if (process.platform === 'win32') {
    return execFileSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', command, ...args], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit']
    });
  }

  return execFileSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit']
  });
}

try {
  if (!fs.existsSync(path.join(DIST, 'package.json'))) {
    throw new Error('dist/package.json is missing. Run the build before packing a release tarball.');
  }

  fs.rmSync(OUT_DIR, { force: true, recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const packJsonRaw = run('npm', ['pack', './dist', '--json', '--pack-destination', OUT_DIR]);
  const jsonStart = packJsonRaw.indexOf('[');

  if (jsonStart === -1) {
    throw new Error('npm pack produced no JSON output.');
  }

  const packInfo = JSON.parse(packJsonRaw.slice(jsonStart))[0];
  const tarballPath = path.join(OUT_DIR, packInfo.filename);
  const packedFiles = packInfo.files.map((file) => file.path);
  const missingFiles = EXPECTED_FILES.filter((file) => !packedFiles.includes(file));

  if (missingFiles.length > 0) {
    throw new Error(`Release tarball is missing expected files: ${missingFiles.join(', ')}`);
  }

  process.stdout.write(`[release:pack] ${tarballPath}\n`);

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `tarball_path=${tarballPath}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `tarball_name=${packInfo.filename}\n`);
  }
} catch (error) {
  process.stderr.write(`[release:pack] ERROR: ${error.message}\n`);
  process.exit(1);
}
