import path from 'path';
import license from 'rollup-plugin-license';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';


// this override is needed because Module format cjs does not support top-level await
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('./package.json');

const globals = { /* ...packageJson.devDependencies, */ };

export default {
  external: Object.keys(globals),
  input: 'src/index.ts',
  output: [ {
    file: packageJson.main,
    format: 'cjs', // commonJS
    sourcemap: false,
  }, {
    file: packageJson.module,
    format: 'esm', // ES Modules
    sourcemap: false,
  } ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs({
      exclude: 'node_modules',
      ignoreGlobal: true,
    }),
    license({
      banner: { content: { file: path.join(__dirname, 'LICENSE') } },
      sourcemap: true,
    }),
  ],
};
