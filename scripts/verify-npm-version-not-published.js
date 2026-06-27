#!/usr/bin/env node
/**
 * Preflight check: ensure the current package version is not already published on npm.
 *
 * Reads version metadata from dist/package.json (preferred) or root package.json.
 * Exits with code 1 if the version already exists on npm, so the publish workflow
 * fails loudly before attempting a duplicate publish.
 * Exits with code 0 if the version is free (npm returns 404).
 *
 * Always queries the public npm registry directly (--registry flag) to bypass any
 * local .npmrc overrides that redirect scoped packages to a private registry.
 *
 * Does NOT require an npm token — uses the public npm registry read API.
 * Does NOT print secrets.
 * Works on Windows (shell: true) and Linux/macOS.
 *
 * Usage:
 *   node scripts/verify-npm-version-not-published.js
 */

'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// ---------------------------------------------------------------------------
// Resolve package metadata
// ---------------------------------------------------------------------------
const root = path.resolve(__dirname, '..');
const distPackageJsonPath = path.join(root, 'dist', 'package.json');
const rootPackageJsonPath = path.join(root, 'package.json');

let pkgPath;

if (fs.existsSync(distPackageJsonPath)) {
  pkgPath = distPackageJsonPath;
  process.stdout.write(`[verify-version] Reading metadata from dist/package.json\n`);
} else {
  pkgPath = rootPackageJsonPath;
  process.stdout.write(`[verify-version] dist/package.json not found, falling back to package.json\n`);
}

let pkg;

try {
  pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
} catch (err) {
  process.stderr.write(`[verify-version] ERROR: Could not parse ${pkgPath}: ${err.message}\n`);
  process.exit(1);
}

const { name, version } = pkg;

if (!name || !version) {
  process.stderr.write(`[verify-version] ERROR: "name" or "version" missing in ${pkgPath}\n`);
  process.exit(1);
}

process.stdout.write(`[verify-version] Checking npm registry for ${name}@${version}\n`);

// ---------------------------------------------------------------------------
// Query the public npm registry directly.
//
// We pass --registry explicitly to bypass any .npmrc overrides that may redirect
// scoped packages (e.g. @garvae/) to a private registry such as GitHub Packages.
//
// shell: true is required on Windows where `npm` resolves to npm.cmd.
// ---------------------------------------------------------------------------
const result = spawnSync(
  'npm',
  ['view', `${name}@${version}`, 'version', '--json', '--registry', 'https://registry.npmjs.org'],
  {
    encoding: 'utf8',
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe']
  }
);

// Spawn-level error (e.g. npm not found on PATH).
if (result.error) {
  process.stderr.write(`[verify-version] ERROR: Failed to spawn npm: ${result.error.message}\n`);
  process.exit(1);
}

const stdout = (result.stdout || '').trim();
const stderr = (result.stderr || '').trim();
const combined = `${stdout}\n${stderr}`;

// npm exits 0 and prints the version string (JSON) when it exists on the registry.
if (result.status === 0 && stdout.length > 0) {
  process.stderr.write(
    `[verify-version] BLOCKED: ${name}@${version} is already published on npm.\n` +
      `  Bump the version in package.json (and rebuild dist/) before publishing.\n`
  );
  process.exit(1);
}

// npm exits non-zero with E404 when the version does not exist.
if (result.status !== 0) {
  if (combined.includes('E404') || combined.includes('404')) {
    process.stdout.write(`[verify-version] OK: ${name}@${version} is not yet published. Safe to publish.\n`);
    process.exit(0);
  }

  // Unknown error from npm — surface it and fail safely.
  process.stderr.write(`[verify-version] ERROR: Unexpected npm response (exit ${result.status}):\n${combined}\n`);
  process.exit(result.status || 1);
}

// npm exited 0 but printed nothing — treat as version not found (safe to publish).
process.stdout.write(`[verify-version] OK: ${name}@${version} — npm returned no output. Safe to publish.\n`);
process.exit(0);
