# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-02-24

### Fixed

- `ClientMessage.date` was typed as `Date`, but `JSON.parse` returns a `string` — corrected to `string`
- `SessionStorageTransport` initialized internal timestamps with `new Date(0,0,0,0,0,0,0)` (Dec 31, 1899) instead of Unix epoch — changed to `new Date(0)`
- `SessionStorageTransport.setMessageItem` now serializes the date with `toISOString()` for reliable round-trip parsing
- `BrowserTabIPC.connect()` now returns immediately with the current state if already connected (double-connect guard)
- `SharedWorkerTransport` XHR file-existence check now applies a 5-second timeout with an `ontimeout` handler
- `ipc-worker.ts` uses `port.onmessage` assignment instead of `addEventListener` for consistent message delivery

### Changed

- `catch` clauses in `BroadcastChannelTransport` and `SharedWorkerTransport` now use `unknown` instead of `any`
- `AbstractTransport.onMessage` parameter typed as `unknown` instead of `any`
- Removed unused functor types (`Action2`–`Action5`, `Func`, `Func1`–`Func5`) from `functors.ts`
- Minimum Node.js version raised to **20.19.0** (dropped EOL Node 18)

### Build

- Rollup config comments translated from Russian to English
- Fixed invalid `extends` entry in `.prettierrc.js` (ESLint-only concept, not valid in Prettier)
- Fixed mixed-quote formatting and Node target in `babel.config.js`
- ESLint flat config now explicitly ignores `node_modules/` and `dist/`
- `postbuild` script added — copies `dist/` to `docs/dist/` automatically after every build

### CI / CD

- CI matrix updated: Node 18 removed, Node 24 added
- `PORT` env variable moved to job level in both workflow files
- npm-publish workflow unified to use Yarn throughout
- Added Dependabot config for the GitHub Actions ecosystem

### Docs & Demo

- Demo moved from `tests/` to `docs/` for GitHub Pages hosting
- Demo landing page redesigned: two-column layout with project description, how-to steps, and transport comparison
- `docs/demo.html` renamed to `docs/index.html`
- Fixed jQuery transport selector bug — `$(..., '#options')` silently returned empty set when `#options` was absent from the DOM
- Root `index.html` redirect updated to `docs/index.html`
- README completely rewritten: API reference tables, Browser Support, Quick Start, How It Works, Troubleshooting, Built With, Contributing sections
- `SECURITY.md` updated to use GitHub Security Advisories instead of public Issues
- Fixed typo in `.gitattributes`: `*.xslx` → `*.xlsx`
- `set-registry.js` modernized: `var` → `const`/`let`, added error handling

---

## [2.0.0] - 2026-02-19

### Added

- Full TypeScript 5.7 rewrite with strict types
- ESLint 9 flat config
- Rollup 4 build producing ESM (`.mjs`), CJS (`.cjs`), UMD (`.umd.js`), minified UMD (`.umd.min.js`), and IIFE (`ipc-worker.js`) artifacts
- Jest 30 + Puppeteer 24 end-to-end integration tests running in a real browser via `jest-puppeteer`
- GitHub Actions CI with Node matrix and Dependabot for npm

### Changed

- Minimum Node.js version: 18.x

---

## [1.2.1] - 2022-08-02

### Fixed

- Integration test reliability improvements

---

## [1.2.0] - 2022-08-02

### Added

- `BroadcastChannel` transport as the new default (fastest, same-origin)
- Automatic transport fallback chain: `BroadcastChannel` → `SharedWorker` → `SessionStorage`

---

## [1.1.0] - 2022-07-26

### Changed

- `EventEmitter` logic moved to `AbstractTransport` base class
- Removed circular dependencies between transport classes

---

## [1.0.0] - 2022-07-25

### Added

- First stable release
- `SharedWorker` and `SessionStorage` transports
- `BrowserTabIPC` public API: `connect()`, `disconnect()`, `postMessage()`, event subscription methods
- UMD build for `<script>` tag usage
- Apache-2.0 license

---

## [0.3.0-rc] - 2022-07-22

### Added

- Transport type exposed in `ConnectionState`
- File-existence check before creating a `SharedWorker`
- Disconnect button in the demo

---

## [0.2.0-beta] - 2022-07-20

### Added

- `SharedWorker` transport as a separate bundled file (`ipc-worker.js`)
- `express-reverse-proxy` dev server
- Puppeteer integration tests via `tree-kill` for server teardown
- Yarn as the package manager

---

## [0.1.0] - 2021-10-18

### Added

- Initial alpha: `SessionStorage`-based cross-tab messaging
- `BrowserTabIPC` core class extending Node's `EventEmitter`
- TypeScript source with ESLint and Prettier setup
