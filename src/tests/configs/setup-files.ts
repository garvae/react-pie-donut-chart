import { TextDecoder, TextEncoder } from 'util';

// Imported here (a .ts file processed by ts-jest as part of the same TS program
// as every spec file) rather than as a plain setupFilesAfterEnv string, so that
// jest-dom's global `jest.Matchers<R, T>` type augmentation (e.g. `toHaveAttribute`)
// is actually picked up by ts-jest's type-checker for every spec file, not just
// applied as a runtime-only matcher extension.
import '@testing-library/jest-dom';

import { originalEnv } from 'utils/env';

global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

const reset = () => {
  jest.clearAllMocks();
  jest.useRealTimers();
  process.env = originalEnv;
};

beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(reset);
afterAll(reset);
