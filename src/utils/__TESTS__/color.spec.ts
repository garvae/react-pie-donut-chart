import { mockConsole } from 'tests/mocks/console';
import { TEST_COLOR } from 'tests/mocks/variables';
import { convertHexToRgb, HEX_REG_EXP, RGB_REG_EXP, randomColorHEX } from 'utils/color';

describe('function "randomColorHEX"', () => {
  it('returns a valid HEX color', () => {
    expect.assertions(1);

    const color = randomColorHEX();

    expect(HEX_REG_EXP.test(color)).toBeTruthy();
  });

  it('returns a valid HEX color even when Math.random returns a value very close to 1 (boundary case)', () => {
    expect.assertions(2);

    const originalRandom = Math.random;
    /**
     * When Math.random() = 0.999999:
     *   - Correct formula: Math.floor(0.999999 * 256) = Math.floor(255.999744) = 255
     *     → channel 255 → all-channels-255 color = '#ffffff'
     *   - Buggy formula:   Math.floor(0.999999 * 257) = Math.floor(256.999743) = 256
     *     → channel 256 overflows the 8-bit range; the bitwise hex computation wraps to
     *       produce '#010100' instead of '#ffffff' — a wrong, though still 7-char, result.
     */
    Math.random = () => 0.999999;

    try {
      const color = randomColorHEX();

      expect(HEX_REG_EXP.test(color)).toBeTruthy();
      expect(color).toBe('#ffffff');
    } finally {
      Math.random = originalRandom;
    }
  });
});

describe('function "convertHexToRgb"', () => {
  it("returns a valid RGB with the provided 3-digit HEX color: [color = 'fff']", () => {
    expect.assertions(2);

    const { consoleErrorMocked } = mockConsole();
    const rgb = convertHexToRgb('fff');

    expect(RGB_REG_EXP.test(rgb)).toBeTruthy();
    expect(consoleErrorMocked).not.toHaveBeenCalled();
  });

  it("returns a valid RGB with the provided 3-digit HEX color with hash symbol: [color = '#fff']", () => {
    expect.assertions(2);

    const { consoleErrorMocked } = mockConsole();
    const rgb = convertHexToRgb('#fff');

    expect(RGB_REG_EXP.test(rgb)).toBeTruthy();
    expect(consoleErrorMocked).not.toHaveBeenCalled();
  });

  it("returns a valid RGB with the provided 6-digit HEX color: [color = 'ffffff']", () => {
    expect.assertions(2);

    const { consoleErrorMocked } = mockConsole();
    const rgb = convertHexToRgb('ffffff');

    expect(RGB_REG_EXP.test(rgb)).toBeTruthy();
    expect(consoleErrorMocked).not.toHaveBeenCalled();
  });

  it("returns a valid RGB with the provided 6-digit HEX color with the hash symbol: [color = '#ffffff']", () => {
    expect.assertions(2);

    const { consoleErrorMocked } = mockConsole();
    const rgb = convertHexToRgb(TEST_COLOR);

    expect(RGB_REG_EXP.test(rgb)).toBeTruthy();
    expect(consoleErrorMocked).not.toHaveBeenCalled();
  });

  it('returns an empty string when the provided value is not a string: [color = 1234]', () => {
    expect.assertions(2);

    const { consoleErrorMocked } = mockConsole();

    // @ts-ignore
    const rgb = convertHexToRgb(1234);

    expect(rgb).toBe('');
    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });

  it("returns an empty string when the provided color is too short: [color = 'FF']", () => {
    expect.assertions(2);

    const { consoleErrorMocked } = mockConsole();

    const rgb = convertHexToRgb('FF');

    expect(rgb).toBe('');
    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });

  it("returns an empty string when the provided color is too long: [color = '#fffffff']", () => {
    expect.assertions(2);

    const { consoleErrorMocked } = mockConsole();

    const rgb = convertHexToRgb('#fffffff');

    expect(rgb).toBe('');
    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });

  it("returns an empty string when the provided value is looks like HEX color string but has invalid symbols: [color = '#fffffp']", () => {
    expect.assertions(2);

    const { consoleErrorMocked } = mockConsole();
    const rgb = convertHexToRgb('#fffffp');

    expect(rgb).toBe('');
    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });

  it("returns an empty string when the provided value is invalid: [color = '*']", () => {
    expect.assertions(2);

    const { consoleErrorMocked } = mockConsole();

    const rgb = convertHexToRgb('*');

    expect(rgb).toBe('');
    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });

  it('returns an empty string when the provided value is undefined: [color = undefined]', () => {
    expect.assertions(2);

    const { consoleErrorMocked } = mockConsole();

    // @ts-ignore
    const rgb = convertHexToRgb(undefined);

    expect(rgb).toBe('');
    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });
});
