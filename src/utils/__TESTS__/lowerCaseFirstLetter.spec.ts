import { mockConsole } from 'tests/mocks/console';
import { lowerCaseFirstLetter } from 'utils/string';

describe('function "lowerCaseFirstLetter"', () => {
  it('returns a valid string when param is valid', () => {
    expect.assertions(1);
    mockConsole();

    const testStr = 'Abc';
    const lowerCasedString = lowerCaseFirstLetter(testStr);

    expect(lowerCasedString).toBe(testStr);
  });

  it('returns an error and a default fallback when incorrect param is provided', () => {
    expect.assertions(1);
    mockConsole();

    const testDefault = '';

    // @ts-ignore
    const lowerCasedString = lowerCaseFirstLetter(123);

    expect(lowerCasedString).toBe(testDefault);
  });

  it('returns an error and a default fallback when empty string is provided', () => {
    expect.assertions(1);
    mockConsole();

    const testDefault = '';

    // @ts-ignore
    const lowerCasedString = lowerCaseFirstLetter('');

    expect(lowerCasedString).toBe(testDefault);
  });
});
