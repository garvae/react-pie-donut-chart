/* eslint-disable sort-keys-fix/sort-keys-fix */
const { aliases } = require('./aliases');

const extendsCommon = [
  'airbnb/hooks',
  'eslint:recommended',
  'plugin:react/recommended',
  'react-app',
];

const extendsJest = [ 'plugin:jest/all' ];

const extendsTypeScript = [
  'airbnb-typescript',
  'plugin:@typescript-eslint/recommended',
  'plugin:import/typescript',
  'plugin:eslint-comments/recommended',
];

const pluginsCommon = [
  '@getify/proper-arrows',
  '@getify/proper-ternary',
  'array-func',
  'destructuring',
  'modules-newlines',
  'newline-destructuring',
  'no-unsanitized',
  'optimize-regex',
  'prettier',
  'react',
  'react-hooks',
  'sort-destructure-keys',
  'sort-keys-fix',
  'unused-imports',
];

const pluginsJest = [ 'jest' ];

const pluginsTypeScript = [ '@typescript-eslint', 'typescript-sort-keys' ];

const rulesCommon = {
  /* --- eslint config --- */
  'array-bracket-spacing': [ 'error', 'always' ],
  'array-callback-return': 'warn',
  'arrow-parens': [ 2, 'as-needed' ],
  'class-methods-use-this': 0,
  'consistent-return': 'warn',
  'comma-dangle': [ 'error', 'always-multiline' ],
  'func-names': [ 'error', 'never' ],
  'indent': [
    'warn',
    2,
    {
      ignoredNodes: [ 'JSXElement' ],
      SwitchCase: 1,
    },
  ],
  'jsx-a11y/label-has-associated-control': 0,
  'linebreak-style': 'off',
  'max-classes-per-file': [ 'error', 100 ],
  'no-console': 'warn',
  'no-implicit-coercion': 'off',
  'no-mixed-operators': 'error',
  'no-multiple-empty-lines': [ 'error', {
    max: 2,
    maxBOF: 1,
    maxEOF: 10,
  } ],
  'no-plusplus': 0,
  'no-shadow': 'off',
  'no-underscore-dangle': 0,
  'object-curly-spacing': [ 'error', 'always' ],
  'padded-blocks': 0,
  'prefer-promise-reject-errors': 'warn',
  'quotes': [
    'error',
    'single',
    { allowTemplateLiterals: false },
  ],
  'semi': [ 'error', 'always' ],
  'space-in-parens': [ 'error', 'never' ],
  'max-params': [ 'error', 2 ],

  /* --- newline / wrapping --- */
  'array-bracket-newline': [ 'error', { minItems: 3 } ],
  'array-element-newline': [ 'error', { minItems: 3 } ],
  'function-call-argument-newline': [ 'error', 'consistent' ],
  'function-paren-newline': [ 'error', { minItems: 4 } ],
  'modules-newlines/export-declaration-newline': 'warn',
  'modules-newlines/import-declaration-newline': 'warn',
  'newline-destructuring/newline': [ 'error', {
    items: 2,
    itemsWithRest: 2,
    maxLength: 20,
  } ],
  'newline-per-chained-call': [ 'error' ],
  'object-curly-newline': [ 'error', {
    ObjectExpression: {
      multiline: false,
      minProperties: 2,
    },
    ObjectPattern: {
      multiline: false,
      minProperties: 2,
    },
    ImportDeclaration: {
      multiline: false,
      minProperties: 2,
    },
    ExportDeclaration: {
      multiline: false,
      minProperties: 2,
    },
  } ],
  'object-property-newline': [ 'error', { allowMultiplePropertiesPerLine: false } ],
  'curly': 'error',

  /* --- optimize-regex --- */
  'optimize-regex/optimize-regex': 'warn',

  /* --- array-func --- */
  'array-func/prefer-array-from': 0,
  'array-func/avoid-reverse': 0,
  'array-func/prefer-flat-map': 'error',
  'array-func/prefer-flat': 'error',

  /* --- unused detection --- */
  'no-unused-vars': 'off',
  'unused-imports/no-unused-imports': 'error',
  'unused-imports/no-unused-vars': [ 'warn', {
    vars: 'all',
    varsIgnorePattern: '^_',
    args: 'after-used',
    argsIgnorePattern: '^_',
  } ],

  /* --- sorting --- */
  'sort-destructure-keys/sort-destructure-keys': [ 2, { caseSensitive: true } ],
  'sort-keys-fix/sort-keys-fix': 'error',

  /* --- imports --- */
  'import/no-anonymous-default-export': 'off',
  'import/namespace': 'error',
  'import/no-named-as-default': 'off',
  'import/export': 'error',
  'import/order': [ 'error', {
    alphabetize: {
      order: 'asc',
      caseInsensitive: true,
    },
    groups: [
      'builtin',
      'external',
      'internal',
      'parent',
      'sibling',
      'index',
    ],
    pathGroups: [
      {
        pattern: 'react*',
        group: 'external',
        position: 'before',
      },
      {
        pattern: '*',
        group: 'external',
        position: 'before',
      },
      {
        pattern: './*.[^scss]',
        group: 'index',
        position: 'before',
      },
      {
        pattern: './*.module.scss',
        group: 'index',
        position: 'after',
      },
    ],
    pathGroupsExcludedImportTypes: [ 'react' ],
    'newlines-between': 'always',
  } ],
  'no-restricted-imports': [ 'error', { patterns: aliases.map(alias => `../${alias}/*`) } ],

  /* --- react --- */
  'react-hooks/exhaustive-deps': 1,
  'react-hooks/rules-of-hooks': 'error',
  'react/destructuring-assignment': 0,
  'react/function-component-definition': [ 2, {
    namedComponents: 'arrow-function',
    unnamedComponents: 'arrow-function',
  } ],
  'react/jsx-boolean-value': 2,
  'react/jsx-closing-bracket-location': [ 2, 'line-aligned' ],
  'react/jsx-closing-tag-location': [ 2, 'line-aligned' ],
  'react/jsx-curly-newline': [ 2, {
    multiline: 'require',
    singleline: 'forbid',
  } ],
  'react/jsx-equals-spacing': 2,
  'react/jsx-filename-extension': [ 2, { extensions: [
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
  ] } ],
  'react/jsx-first-prop-new-line': [ 2, 'multiline-multiprop' ],
  'react/jsx-fragments': [ 2, 'syntax' ],
  'react/jsx-indent': [
    2,
    2,
    {
      indentLogicalExpressions: true,
      checkAttributes: false,
    },
  ],
  'react/jsx-indent-props': [ 2, 2 ],
  'react/jsx-key': 2,
  'react/jsx-max-props-per-line': [ 1, { maximum: 1 } ],
  'react/jsx-newline': [ 2, { prevent: false } ],
  'react/jsx-no-comment-textnodes': 1,
  'react/jsx-no-bind': 0,
  'react/jsx-no-constructed-context-values': 1,
  'react/jsx-no-duplicate-props': 2,
  'react/jsx-no-target-blank': [ 2, {
    allowReferrer: false,
    enforceDynamicLinks: 'always',
  } ],
  'react/jsx-no-useless-fragment': 2,
  'react/jsx-props-no-multi-spaces': 2,
  'react/jsx-props-no-spreading': 0,
  'react/jsx-sort-default-props': 1,
  'react/jsx-sort-props': 2,
  'react/jsx-tag-spacing': [ 2, {
    closingSlash: 'never',
    beforeSelfClosing: 'always',
    afterOpening: 'never',
    beforeClosing: 'never',
  } ],
  'react/jsx-wrap-multilines': [ 2, {
    declaration: 'parens-new-line',
    assignment: 'parens-new-line',
    return: 'parens-new-line',
    arrow: 'parens-new-line',
    condition: 'parens-new-line',
    logical: 'parens-new-line',
    prop: 'parens-new-line',
  } ],
  'react/no-danger': 2,
  'react/no-typos': 2,
  'react/no-unescaped-entities': 2,
  'react/no-unstable-nested-components': [ 1, { allowAsProps: true } ],
  'react/no-unused-prop-types': 1,
  'react/prop-types': 0,
  'react/react-in-jsx-scope': 2,
  'react/react/jsx-curly-brace-presence': 0,
  'react/require-default-props': [ 0 ],
  'react/sort-comp': 2,


  /* --- @getify --- */
  '@getify/proper-ternary/nested': 'error',
  '@getify/proper-ternary/parens': 0,
  '@getify/proper-ternary/where': [ 'error', {
    statement: true,
    property: false,
    argument: true,
    return: false,
    default: true,
    sub: true,
    assignment: false,
  } ],
  '@getify/proper-arrows/name': 'off',
  '@getify/proper-arrows/params': 'off' /* replaced with <'max-params': ['error', 1]>, */,
  '@getify/proper-arrows/return': [ 'error', {
    object: false,
    chained: false,
    sequence: true,
    trivial: true,
    ternary: 2,
  } ],
  '@getify/proper-arrows/this': 'off',
  '@getify/proper-arrows/where': 'off',

  /* --- no-unsanitized --- */
  'no-unsanitized/method': 'error',
  'no-unsanitized/property': 'error',

  /* --- destructuring --- */
  'destructuring/no-rename': 'off',
  'destructuring/in-params': [ 'error', { 'max-params' : 0 } ],
  'destructuring/in-methods-params': 'off',

  /* --- eslint-comments --- */
  'eslint-comments/no-restricted-disable': [ 'error', 'react-hooks/exhaustive-deps' ],
  'eslint-comments/disable-enable-pair': [ 'error', { 'allowWholeFile': true } ],
  'eslint-comments/no-duplicate-disable': 'error',
  'eslint-comments/no-unlimited-disable': 'off',
  'eslint-comments/no-use': 'off',

  /* --- prettier config --- */
  'prettier/prettier': [ 'error', {
    arrowParens: 'avoid',
    bracketSameLine: false,
    bracketSpacing: true,
    embeddedLanguageFormatting: 'auto',
    endOfLine: 'auto',
    htmlWhitespaceSensitivity: 'css',
    insertPragma: false,
    jsxSingleQuote: true,
    lineLength: 120,
    printWidth: 120,
    proseWrap: 'preserve',
    quoteProps: 'as-needed',
    rangeEnd: 0,
    rangeStart: 0,
    requirePragma: false,
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'all',
    useTabs: false,
    vueIndentScriptAndStyle: false,
  } ],
};

const rulesJest = {
  'jest/no-disabled-tests': 'warn',
  'jest/no-focused-tests': 'error',
  'jest/no-identical-title': 'error',
  'jest/prefer-to-have-length': 'warn',
  'jest/valid-expect': 'error',
};

const rulesTypeScript = {
  /* --- TypeScript-eslint rules --- */
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/no-shadow': [ 'error', { ignoreTypeValueShadow: true } ],
  '@typescript-eslint/no-unused-vars': 'off',
  'typescript-sort-keys/interface': 'error',
  'typescript-sort-keys/string-enum': 'error',
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/naming-convention': [
    2,
    {
      selector: 'variable',
      format: [
        'camelCase',
        'UPPER_CASE',
        'PascalCase',
      ],
      leadingUnderscore: 'allow',
      trailingUnderscore: 'allow',
    },
    {
      selector: 'function',
      format: [ 'PascalCase', 'camelCase' ],
    },
    {
      selector: 'interface',
      format: [ 'PascalCase' ],
      trailingUnderscore: 'allow',
      custom: {
        regex: '^I[A-Z]',
        match: true,
      },
    },
    {
      selector: 'typeLike',
      format: [ 'PascalCase' ],
    },
    {
      selector: 'typeAlias',
      format: [ 'PascalCase' ],
      custom: {
        regex: '^T[A-Z]',
        match: true,
      },
    },
  ],
};

const settingsCommon = {
  react: { version: 'detect' },
  jest: { version: require('jest/package.json').version },
};

const envCommon = {
  browser: true,
  es6: true,
  'jest/globals': true,
  commonjs: true,
};


const configCommon = {
  settings: settingsCommon,
  env: envCommon,
};

const overridesTypeScript = {
  files: [ '*.ts', '*.tsx' ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion:  2020,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
    project: [ './tsconfig.json' ],
  },

  extends: [ ...extendsCommon, ...extendsTypeScript ],

  plugins: [ ...pluginsCommon, ...pluginsTypeScript ],

  rules: {
    ...rulesCommon,
    ...rulesTypeScript,
  },

  ...configCommon,
};

const overridesTypeScriptJest = {
  ...overridesTypeScript,
  files: [ '*.test.*', '*.spec.*' ],
  extends: [ ...overridesTypeScript.extends, ...extendsJest ],
  plugins: [ ...overridesTypeScript.plugins, ...pluginsJest ],
  rules: {
    ...overridesTypeScript.rules,
    ...rulesJest,
  },
  ...configCommon,
};

const config = {
  root: true,
  extends: [ ...extendsCommon ],
  plugins: [ ...pluginsCommon, ...pluginsJest ],
  rules: rulesCommon,
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    document: true,
    window: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: { babelOptions: { 'presets': [ '@babel/preset-react' ] } },

  /* --- overrides --- */
  overrides: [ overridesTypeScript, overridesTypeScriptJest ],

  ...configCommon,

  /* --- ignore --- */
  ignorePatterns: [
    '**/.nyc_output',
    '**/build',
    '**/cache',
    '**/coverage',
    '**/dist',
    '**/dist-dev',
    '**/fixture',
    '**/node_modules',
    '**/package-lock.json',
    '**/temp',
  ],
};

module.exports = config;
/* eslint-enable sort-keys-fix/sort-keys-fix */
