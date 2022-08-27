const fs = require('fs');
const { resolve } = require('path');

try {
  const raw = fs.readFileSync(resolve(__dirname,'../', 'package.json'));
  const parsed = JSON.parse(raw);

  delete parsed['lint-staged'];
  delete parsed.resolutions;
  delete parsed.scripts;
  delete parsed['husky'];
  delete parsed.prettier;
  delete parsed.devDependencies;

  const distPackageJsonPath = resolve(__dirname, '../', 'dist/package.json');

  const newJson = {
    ...parsed,
    'main': 'index.js',
    'module': 'react-pie-chart.esm.js',
    'typings': 'index.d.ts',
    'umd:main': 'index.js',
  };

  const newJsonData = JSON.stringify(newJson, null, 2);

  if (fs.existsSync(distPackageJsonPath)) {
    fs.unlinkSync(distPackageJsonPath);
    fs.writeFileSync(distPackageJsonPath, newJsonData);
  } else {
    fs.writeFileSync(distPackageJsonPath, newJsonData);
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.log('package.json generating error');
}
