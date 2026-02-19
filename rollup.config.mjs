import {createRequire} from 'module';

const require = createRequire(import.meta.url);

const uglify = require('@lopatnov/rollup-plugin-uglify');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const resolve = require('@rollup/plugin-node-resolve');
const typescript = require('rollup-plugin-typescript2');
const ts = require('typescript');

const pkg = require('./package.json');

const external = [...Object.keys(pkg.devDependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

const plugins = [
  json(),
  typescript({typescript: ts}),
  resolve({browser: true, preferBuiltins: false}),
  commonjs(),
];

export default [
  // ESM (.mjs) + CJS (.cjs)
  {
    input: `src/${pkg.libraryFile}.ts`,
    output: [
      {
        file: pkg.module, // dist/library.mjs
        format: 'es',
        sourcemap: true,
      },
      {
        file: pkg.main, // dist/library.cjs
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
    ],
    external,
    plugins,
  },
  // UMD — for browser <script> tags
  {
    input: `src/${pkg.libraryFile}.ts`,
    output: {
      file: `dist/${pkg.libraryFile}.umd.js`,
      name: pkg.umdName,
      format: 'umd',
      sourcemap: true,
      globals: {
        events: 'EventEmitter',
      },
    },
    external,
    plugins,
  },
  // UMD minified
  {
    input: `src/${pkg.libraryFile}.ts`,
    output: {
      file: `dist/${pkg.libraryFile}.umd.min.js`,
      name: pkg.umdName,
      format: 'umd',
      sourcemap: true,
      globals: {
        events: 'EventEmitter',
      },
    },
    external,
    plugins: [...plugins, uglify()],
  },
  // SharedWorker script (IIFE — for browser worker context)
  {
    input: `src/ipc-worker.ts`,
    output: [
      {
        file: 'dist/ipc-worker.js',
        format: 'iife',
        sourcemap: true,
      },
    ],
    plugins,
  },
];
