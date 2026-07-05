const fs = require('fs');
const { resolve } = require('path');

try {
  const raw = fs.readFileSync(resolve(__dirname, '../', 'package.json'));
  const parsed = JSON.parse(raw);

  delete parsed['lint-staged'];
  delete parsed.resolutions;
  delete parsed.scripts;
  delete parsed.husky;
  delete parsed.pnpm;
  delete parsed.packageManager;
  delete parsed.prettier;
  delete parsed.devDependencies;
  delete parsed['size-limit'];

  const distPackageJsonPath = resolve(__dirname, '../', 'dist/package.json');

  const newJson = {
    ...parsed,
    exports: {
      '.': {
        types: './index.d.ts',
        import: './react-pie-donut-chart.esm.js',
        require: './index.js',
        default: './index.js'
      }
    },
    main: 'index.js',
    module: 'react-pie-donut-chart.esm.js',
    sideEffects: false,
    types: 'index.d.ts',
    typings: 'index.d.ts',
    'umd:main': 'index.js',
    // Override the root `files` field: when publishing from `./dist`, the package
    // root IS the dist directory, so "dist" no longer refers to a subdirectory.
    // Use explicit globs that correctly include all artefacts at the dist root.
    files: ['*.js', '*.d.ts']
  };

  const newJsonData = JSON.stringify(newJson, null, 2);

  if (fs.existsSync(distPackageJsonPath)) {
    fs.unlinkSync(distPackageJsonPath);
    fs.writeFileSync(distPackageJsonPath, newJsonData);
  } else {
    fs.writeFileSync(distPackageJsonPath, newJsonData);
  }
} catch (error) {
  process.stderr.write(`package.json generating error: ${error.message}\n`);
  process.exitCode = 1;
}
