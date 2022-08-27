import { mockConsole } from 'tests/mocks/console';
import {
  sanitizeNumber,
  DEFAULT_SANITISE_NUMBER_VALUE,
} from 'utils/sanitizeNumber';

describe('function "sanitizeNumber"', () => {
  it('returns a valid number when props are valid', () => {
    expect.assertions(1);
    mockConsole();

    const testNum = 1;
    const sanitizedValue = sanitizeNumber(testNum);

    expect(sanitizedValue).toBe(testNum);
  });

  it('returns a valid provided fallback when incorrect params are provided', () => {
    expect.assertions(1);
    mockConsole();

    const testDefault = 3;
    // @ts-ignore
    const sanitizedValue = sanitizeNumber('abc', testDefault);

    expect(sanitizedValue).toBe(testDefault);
  });

  it('returns a valid default fallback when incorrect params are provided and no default value is provided', () => {
    expect.assertions(1);
    mockConsole();

    // @ts-ignore
    const sanitizedValue = sanitizeNumber('abc');

    expect(sanitizedValue).toBe(DEFAULT_SANITISE_NUMBER_VALUE);
  });
});
