import { mockConsole } from 'tests/mocks/console';
import { alignConsoleTextLeft } from 'utils/console';

describe('function "alignConsoleTextLeft"', () => {
  it('returns a valid string when param is valid', () => {
    expect.assertions(1);
    mockConsole();

    const testStr = 'Abc';
    const lowerCasedString = alignConsoleTextLeft(testStr);

    expect(lowerCasedString).toBe(testStr);
  });

  it('returns an error and a default fallback when incorrect param is provided', () => {
    expect.assertions(1);
    mockConsole();

    const testDefault = '';

    // @ts-ignore
    const lowerCasedString = alignConsoleTextLeft(123);

    expect(lowerCasedString).toBe(testDefault);
  });

  it('returns an error and a default fallback when empty string is provided', () => {
    expect.assertions(1);
    mockConsole();

    const testDefault = '';

    // @ts-ignore
    const lowerCasedString = alignConsoleTextLeft('');

    expect(lowerCasedString).toBe(testDefault);
  });
});
