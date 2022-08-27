import {
  TextEncoder,
  TextDecoder,
} from 'util';

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
