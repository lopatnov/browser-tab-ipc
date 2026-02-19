# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] — 2026

### Added

- **BroadcastChannel transport** — new default transport (fastest, no server needed)
- **SharedWorker transport** — cross-tab communication via a shared worker script
- **SessionStorage transport** — fallback transport using localStorage events
- Automatic transport fallback chain: BroadcastChannel → SharedWorker → SessionStorage
- ESM (`.mjs`), CJS (`.cjs`), UMD (`.umd.js`), and minified UMD (`.umd.min.js`) dist outputs
- `exports` field in `package.json` for proper ESM/CJS resolution
- `sideEffects: false` for tree-shaking support
- `ConnectionOptions` exported from the public API

### Changed

- Upgraded to TypeScript 5.7, Rollup 4, ESLint 9 (flat config), Prettier 3
- Updated all devDependencies to latest versions (2025–2026)
- Minimum Node.js version is now 18.0.0
- `target` changed from `es5` to `es2019`
- `moduleResolution` changed to `Bundler`

### Fixed

- SessionStorage transport: `postMessage` was silently dropping all messages due to wrong property name
- SessionStorage transport: cleanup timer was not cleared on disconnect (memory leak)
- `BrowserTabIPC.postMessage`: race condition when called before `connect()` (missing `await`)

### Removed

- Travis CI configuration (replaced by GitHub Actions)
- IE 11 / ES5 support
