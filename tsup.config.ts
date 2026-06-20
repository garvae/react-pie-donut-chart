import fs from 'fs';
import path from 'path';
import { defineConfig } from 'tsup';

const license = fs.readFileSync(path.join(__dirname, 'LICENSE'), 'utf8');
const banner = `/*!\n${license.trim()}\n*/`;

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['cjs'],
    outDir: 'dist',
    target: 'es2017',
    platform: 'browser',
    external: ['react', 'react-dom'],
    sourcemap: false,
    dts: false,
    clean: false,
    splitting: false,
    minify: false,
    treeshake: true,
    banner: { js: banner },
    esbuildOptions(options) {
      options.jsx = 'transform';
      options.jsxFactory = 'React.createElement';
      options.jsxFragment = 'React.Fragment';
    }
  },
  {
    entry: { 'react-pie-donut-chart.esm': 'src/index.ts' },
    format: ['esm'],
    outDir: 'dist',
    target: 'es2017',
    platform: 'browser',
    external: ['react', 'react-dom'],
    sourcemap: false,
    dts: false,
    clean: false,
    splitting: false,
    minify: false,
    treeshake: true,
    banner: { js: banner },
    outExtension: () => ({ js: '.js' }),
    esbuildOptions(options) {
      options.jsx = 'transform';
      options.jsxFactory = 'React.createElement';
      options.jsxFragment = 'React.Fragment';
    }
  }
]);
