const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = require('./tsconfig');
const tsConfigPaths = { ...compilerOptions.paths };
delete tsConfigPaths['tslib'];

const config = {
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  bail: 1,

  // The directory where Jest should store its cached dependency information
  cacheDirectory: './cache/jest',

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // Path where to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/node_modules/',
    '!<rootDir>/src/**/*.d.{js,jsx,ts,tsx}',
    '!<rootDir>/src/**/*.types.{js,jsx,ts,tsx}',
    '!<rootDir>/src/tests/**/*',
    '!<rootDir>/src/types/**/*',
    '!<rootDir>/src/index.ts',
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [ '/node_modules/' ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    'json',
    'text',
    'lcov',
    'clover',
  ],

  // Make calling deprecated APIs throw helpful error messages
  errorOnDeprecated: true,

  // The default configuration for fake timers
  // fakeTimers: { 'enableGlobally': true, },

  // A set of global variables that need to be available in all test environments
  globals: {
    '__DEV__': true,
    'ts-jest': { tsconfig: './tsconfig.test.json' },
  },

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  maxWorkers: '50%',

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: [ 'node_modules' ],

  // An array of file extensions your modules use
  moduleFileExtensions: [
    'js',
    'mjs',
    'cjs',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node',
  ],

  // aliases
  moduleNameMapper: pathsToModuleNameMapper(tsConfigPaths, { prefix: '<rootDir>/src/' }),

  // Automatically reset mock state before every test
  resetMocks: true,

  // Reset the module registry before running each individual test
  // resetModules: false,

  // Automatically restore mock state and implementation before every test
  // restoreMocks: false,

  // The root directory that Jest should scan for tests and modules within
  rootDir: './',

  // A list of paths to directories that Jest should use to search for files in
  roots: [ '<rootDir>/src' ],

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: [ '<rootDir>/src/tests/configs/setup-env.ts' ],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: [ '@testing-library/jest-dom/extend-expect', '<rootDir>/src/tests/configs/setup-files.ts' ],

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  slowTestThreshold: 10,

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},

  // The glob patterns Jest uses to detect test files
  testMatch: [ '**/?(*.)+(spec|test).[tj]s?(x)' ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [ '/node_modules/', '/ignore/' ],

  // babel-jest is automatically installed when installing Jest and will automatically transform files
  // if a babel configuration exists in your project. To avoid this behavior,
  // you can explicitly reset the transform configuration option: 'transform: {}'
  transform: { '^.+\\.(t|j)sx?$': 'ts-jest' },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [ '\\\\node_modules\\\\', '\\.pnp\\.[^\\\\]+$' ],

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
  // watchPathIgnorePatterns: [],

  // Whether to use watchman for file crawling
  // watchman: true,

};

module.exports = config;
