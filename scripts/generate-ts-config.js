const fs = require('fs');
const path = require('path');

const { aliases } = require('../aliases');
const tsconfig = require('../tsconfig.base.json');

const root = path.resolve(__dirname, '../');

const paths = aliases.map(path => [ `${path}/*`, [ `./${path}/*` ] ]);

const newJsonObj = {
  ...tsconfig,
  'compilerOptions': {
    ...tsconfig.compilerOptions,
    'paths': {
      ...tsconfig.compilerOptions.paths,
      ...Object.fromEntries(paths),
    },
  },
};

const jsonContent = JSON.stringify(newJsonObj);

fs.writeFile(
  `${root}/tsconfig.json`, jsonContent, 'utf8', err => {
    if (err) {
      console.error('An error occurred while generating tsconfig.json');
      return console.error(err);
    }

    console.log('tsconfig.json has been generated');
  },
);
