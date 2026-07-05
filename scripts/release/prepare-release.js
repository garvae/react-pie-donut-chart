#!/usr/bin/env node
'use strict';

/**
 * Prepares the repository for a release by updating the root package version.
 * The build step is intentionally separate so the caller can run quality gates
 * after the version change and before the package artefacts are generated.
 */

const fs = require('node:fs');
const path = require('node:path');
const semver = require('semver');

const ROOT = path.resolve(__dirname, '..', '..');
const PACKAGE_JSON_PATH = path.join(ROOT, 'package.json');

/**
 * Parse CLI arguments in `--key value` form.
 * @returns {Record<string, string>}
 */
function parseArgs() {
  const args = {};

  for (let i = 2; i < process.argv.length; i += 1) {
    const token = process.argv[i];

    if (!token.startsWith('--')) {
      continue;
    }

    const key = token.slice(2);
    const value = process.argv[i + 1];

    if (!value || value.startsWith('--')) {
      args[key] = 'true';
      i -= 1;
      continue;
    }

    args[key] = value;
  }

  return args;
}

/**
 * Resolve the next version from the provided release options.
 * @param {string} currentVersion
 * @param {Record<string, string>} args
 * @returns {string}
 */
function resolveNextVersion(currentVersion, args) {
  const releaseType = args['release-type'];
  const customVersion = args['custom-version'];
  const prereleaseId = args['prerelease-id'] || 'next';

  if (!releaseType) {
    throw new Error('Missing required "--release-type" argument.');
  }

  if (releaseType === 'custom') {
    if (!customVersion) {
      throw new Error('Missing required "--custom-version" argument for release-type=custom.');
    }

    if (!semver.valid(customVersion)) {
      throw new Error(`Invalid custom version: ${customVersion}`);
    }

    return customVersion;
  }

  const nextVersion = semver.inc(currentVersion, releaseType, prereleaseId);

  if (!nextVersion) {
    throw new Error(`Could not calculate next version from "${currentVersion}" using release type "${releaseType}".`);
  }

  return nextVersion;
}

/**
 * Update `package.json` version while preserving formatting.
 * @param {string} nextVersion
 */
function updatePackageVersion(nextVersion) {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  pkg.version = nextVersion;
  fs.writeFileSync(PACKAGE_JSON_PATH, `${JSON.stringify(pkg, null, 2)}\n`);
}

try {
  const args = parseArgs();
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  const currentVersion = pkg.version;

  if (!semver.valid(currentVersion)) {
    throw new Error(`Current package version is invalid: ${currentVersion}`);
  }

  const nextVersion = resolveNextVersion(currentVersion, args);
  const isPrerelease = semver.prerelease(nextVersion) !== null;
  updatePackageVersion(nextVersion);

  process.stdout.write(`[release:prepare] ${currentVersion} -> ${nextVersion}\n`);

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `release_version=${nextVersion}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `is_prerelease=${isPrerelease}\n`);
  }
} catch (error) {
  process.stderr.write(`[release:prepare] ERROR: ${error.message}\n`);
  process.exit(1);
}
