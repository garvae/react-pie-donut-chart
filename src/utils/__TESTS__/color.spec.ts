import { mockConsole } from 'tests/mocks/console';
import { TEST_COLOR } from 'tests/mocks/variables';
import {
  randomColorHEX,
  convertHexToRgb,
  HEX_REG_EXP,
  RGB_REG_EXP,
} from 'utils/color';

describe('function "randomColorHEX"', () => {
  it('returns a valid HEX color', () => {
    expect.assertions(1);

    const color = randomColorHEX();

    expect(HEX_REG_EXP.test(color)).toBeTruthy();
  });
});

describe('function "convertHexToRgb"', () => {
  it('returns a valid RGB with the provided 3-digit HEX color: [color = \'fff\']', () => {
    expect.assertions(2);

    const { consoleErrorMocked }  = mockConsole();
    const rgb = convertHexToRgb('fff');

    expect(RGB_REG_EXP.test(rgb)).toBeTruthy();
    expect(consoleErrorMocked).not.toHaveBeenCalled();
  });

  it('returns a valid RGB with the provided 3-digit HEX color with hash symbol: [color = \'#fff\']', () => {
    expect.assertions(2);

    const { consoleErrorMocked }  = mockConsole();
    const rgb = convertHexToRgb('#fff');

    expect(RGB_REG_EXP.test(rgb)).toBeTruthy();
    expect(consoleErrorMocked).not.toHaveBeenCalled();
  });

  it('returns a valid RGB with the provided 6-digit HEX color: [color = \'ffffff\']', () => {
    expect.assertions(2);

    const { consoleErrorMocked }  = mockConsole();
    const rgb = convertHexToRgb('ffffff');

    expect(RGB_REG_EXP.test(rgb)).toBeTruthy();
    expect(consoleErrorMocked).not.toHaveBeenCalled();
  });

  it('returns a valid RGB with the provided 6-digit HEX color with the hash symbol: [color = \'#ffffff\']', () => {
    expect.assertions(2);

    const { consoleErrorMocked }  = mockConsole();
    const rgb = convertHexToRgb(TEST_COLOR);

    expect(RGB_REG_EXP.test(rgb)).toBeTruthy();
    expect(consoleErrorMocked).not.toHaveBeenCalled();
  });

  it('returns an empty string when the provided value is not a string: [color = 1234]', () => {
    expect.assertions(2);

    const { consoleErrorMocked }  = mockConsole();

    // @ts-ignore
    const rgb = convertHexToRgb(1234);

    expect(rgb).toBe('');
    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });

  it('returns an empty string when the provided color is too short: [color = \'FF\']', () => {
    expect.assertions(2);

    const { consoleErrorMocked }  = mockConsole();

    const rgb = convertHexToRgb('FF');

    expect(rgb).toBe('');
    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });

  it('returns an empty string when the provided color is too long: [color = \'#fffffff\']', () => {
    expect.assertions(2);

    const { consoleErrorMocked }  = mockConsole();

    const rgb = convertHexToRgb('#fffffff');

    expect(rgb).toBe('');
    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });

  it('returns an empty string when the provided value is looks like HEX color string but has invalid symbols: [color = \'#fffffp\']', () => {
    expect.assertions(2);

    const { consoleErrorMocked }  = mockConsole();
    const rgb = convertHexToRgb('#fffffp');

    expect(rgb).toBe('');
    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });

  it('returns an empty string when the provided value is invalid: [color = \'*\']', () => {
    expect.assertions(2);

    const { consoleErrorMocked }  = mockConsole();

    const rgb = convertHexToRgb('*');

    expect(rgb).toBe('');
    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });

  it('returns an empty string when the provided value is undefined: [color = undefined]', () => {
    expect.assertions(2);

    const { consoleErrorMocked }  = mockConsole();

    // @ts-ignore
    const rgb = convertHexToRgb(undefined);

    expect(rgb).toBe('');
    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });
});
