// Jest's CLI only sets `process.env.NODE_ENV = 'test'` when it is not already
// defined. On machines where NODE_ENV is already set in the shell/OS environment
// (e.g. NODE_ENV=production left over from unrelated tooling), Jest will not
// override it, which silently breaks `utils/env.ts`'s `isTest()`/`isProduction()`
// helpers and any test-only code paths that rely on them.
//
// This file runs via Jest's `setupFiles` — before the test framework is
// installed and before any test file (or `utils/env.ts`) is imported — so it is
// the earliest, most reliable place to force a consistent test environment
// regardless of the host machine's ambient environment variables.
process.env.NODE_ENV = 'test';

export {};
