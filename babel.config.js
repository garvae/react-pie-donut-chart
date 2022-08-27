module.exports = api => {

  const isTest = api.env('test');

  if (isTest){
    return { presets: [ [ '@babel/preset-env', { targets: { node: 'current' } } ], '@babel/preset-react' ] };
  }

  return {
    ignore: [
      '**/*.stories.*',
      '**/__mocks__',
      '**/__tests__',
      '**/test-utils',
      'build',
      'dist',
      'node_modules',
      'public',
      'test',
      'test-environment',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-optional-chaining',
    ],
    presets: [
      '@babel/preset-typescript',
      '@babel/react',
      [ '@babel/env', {
        modules: false,
        targets: {
          browsers: [ 'last 2 versions' ],
          node: '12',
        },
      } ],
    ],
  };
};
