import { isClient, isProduction, isTest, originalEnv } from 'utils/env';

describe('function "isClient"', () => {
  it('returns a valid value', () => {
    expect.assertions(1);
    /**
     * Valid because jest runs in jsdom which is client
     */
    expect(isClient()).toBeTruthy();
  });

  it('returns [false] when "window" is undefined (SSR-like environment)', () => {
    expect.assertions(1);

    const originalWindow = global.window;

    // @ts-expect-error - simulating a non-browser (SSR) environment on purpose
    delete global.window;

    try {
      expect(isClient()).toBeFalsy();
    } finally {
      global.window = originalWindow;
    }
  });

  it('returns [false] when "document" is undefined (SSR-like environment)', () => {
    expect.assertions(1);

    const originalDocument = global.document;

    // @ts-expect-error - simulating a non-browser (SSR) environment on purpose
    delete global.document;

    try {
      expect(isClient()).toBeFalsy();
    } finally {
      global.document = originalDocument;
    }
  });
});

describe('function "isProduction"', () => {
  it('returns [true] when NODE_ENV === "production"', () => {
    expect.assertions(1);

    process.env = {
      ...originalEnv,
      NODE_ENV: 'production'
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

  it('returns [false] when "process" is undefined (non-Node environment)', () => {
    expect.assertions(1);

    const originalProcess = global.process;

    // @ts-expect-error - simulating an environment with no global "process" on purpose
    delete global.process;

    try {
      expect(isProduction()).toBeFalsy();
    } finally {
      global.process = originalProcess;
    }
  });
});

describe('function "isTest"', () => {
  it('returns [true] when NODE_ENV !== "test"', () => {
    expect.assertions(1);

    process.env = {
      ...originalEnv,
      NODE_ENV: 'production'
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

  it('returns [false] when "process" is undefined (non-Node environment)', () => {
    expect.assertions(1);

    const originalProcess = global.process;

    // @ts-expect-error - simulating an environment with no global "process" on purpose
    delete global.process;

    try {
      expect(isTest()).toBeFalsy();
    } finally {
      global.process = originalProcess;
    }
  });
});
