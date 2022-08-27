import {
  isClient,
  isProduction,
  isTest,
  originalEnv,
} from 'utils/env';


describe('function "isClient"', () => {
  it('returns a valid value', () => {
    expect.assertions(1);
    /**
     * Valid because jest runs in jsdom which is client
     */
    expect(isClient()).toBeTruthy();
  });
});

describe('function "isProduction"', () => {
  it('returns [true] when NODE_ENV === "production"', () => {
    expect.assertions(1);

    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
    };

    expect(isProduction()).toBeTruthy();
  });

  it('returns [false] when NODE_ENV !== "production"', () => {
    expect.assertions(1);
    process.env = originalEnv;

    /**
     * Valid because Jest runs with provided "NODE_ENV: 'test'" (jest.config.js)
     */
    expect(isProduction()).toBeFalsy();
  });
});

describe('function "isTest"', () => {
  it('returns [true] when NODE_ENV !== "test"', () => {
    expect.assertions(1);

    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
    };

    expect(isTest()).toBeFalsy();
  });

  it('returns [true] when NODE_ENV === "test"', () => {
    expect.assertions(1);
    process.env = originalEnv;

    /**
     * Valid because Jest runs with provided "NODE_ENV: 'test'" (jest.config.js)
     */
    expect(isTest()).toBeTruthy();
  });
});
