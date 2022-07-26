import uglify from '@lopatnov/rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

export default [
  {
    input: `src/${pkg.libraryFile}.ts`,
    output: [
      {
        file: pkg.main,
        format: 'umd',
        name: pkg.umdName,
        sourcemap: true,
        globals: {
          events: 'EventEmitter',
        },
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
        globals: {
          events: 'EventEmitter',
        },
      },
    ],
    external: [...Object.keys(pkg.devDependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      json(),
      typescript({
        typescript: require('typescript'),
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
    ],
  },
  {
    input: `src/${pkg.libraryFile}.ts`,
    output: {
      file: `dist/${pkg.libraryFile}.min.js`,
      name: pkg.umdName,
      format: 'umd',
      sourcemap: true,
      globals: {
        events: 'EventEmitter',
      },
    },
    external: [...Object.keys(pkg.devDependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      json(),
      typescript({
        typescript: require('typescript'),
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      uglify(),
    ],
  },
  {
    input: `src/ipc-worker.ts`,
    output: [
      {
        file: 'dist/ipc-worker.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      json(),
      typescript({
        typescript: require('typescript'),
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
    ],
  },
];
