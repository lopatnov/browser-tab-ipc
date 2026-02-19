# browser-tab-ipc

> Lightweight cross-tab messaging library for TypeScript / JavaScript.
> Exchange messages between browser tabs with automatic transport selection and graceful fallback.

[![npm downloads](https://img.shields.io/npm/dt/@lopatnov/browser-tab-ipc)](https://www.npmjs.com/package/@lopatnov/browser-tab-ipc)
[![npm version](https://badge.fury.io/js/%40lopatnov%2Fbrowser-tab-ipc.svg)](https://www.npmjs.com/package/@lopatnov/browser-tab-ipc)
[![License](https://img.shields.io/github/license/lopatnov/browser-tab-ipc)](https://github.com/lopatnov/browser-tab-ipc/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/lopatnov/browser-tab-ipc)](https://github.com/lopatnov/browser-tab-ipc/issues)
[![GitHub stars](https://img.shields.io/github/stars/lopatnov/browser-tab-ipc)](https://github.com/lopatnov/browser-tab-ipc/stargazers)

---

## Browser Support

| Transport        | Chrome | Firefox | Safari | Edge | Notes                          |
| ---------------- | ------ | ------- | ------ | ---- | ------------------------------ |
| BroadcastChannel | 54+    | 38+     | 15.4+  | 79+  | Default — fastest, same-origin |
| SharedWorker     | 4+     | 29+     | 16+    | 79+  | Cross-origin capable           |
| SessionStorage   | all    | all     | all    | all  | Universal fallback             |

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [API Reference](#api-reference)
  - [class BrowserTabIPC](#class-browsertabipc)
  - [ConnectionOptions](#connectionoptions)
  - [ConnectionState](#connectionstate)
  - [TransportType](#transporttype)
  - [Events](#events)
- [SharedWorker Setup](#sharedworker-setup)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

**npm:**

```shell
npm install @lopatnov/browser-tab-ipc
```

**yarn:**

```shell
yarn add @lopatnov/browser-tab-ipc
```

**CDN (UMD, no bundler required):**

```html
<script src="https://lopatnov.github.io/browser-tab-ipc/dist/library.umd.min.js"></script>
```

---

## Quick Start

```typescript
import {BrowserTabIPC} from '@lopatnov/browser-tab-ipc';

const ipc = new BrowserTabIPC();

// Listen for messages from other tabs
ipc.message((data) => {
  console.log('Received:', data);
});

// Connect and send
await ipc.connect();
await ipc.postMessage({event: 'tab-opened', tabId: crypto.randomUUID()});
```

Open the same page in multiple tabs — every tab receives the message instantly.

---

## How It Works

`BrowserTabIPC` tries each transport in order and uses the first one that connects successfully:

```
BroadcastChannel  →  SharedWorker  →  SessionStorage
    (fastest)          (flexible)       (always works)
```

You can override this by specifying a single transport or a custom fallback list via `ConnectionOptions`.

---

## API Reference

### class BrowserTabIPC

`BrowserTabIPC` extends Node's `EventEmitter` and provides a clean connect / send / receive interface.

#### `new BrowserTabIPC(options?: ConnectionOptions)`

Creates an instance. Options set here apply to all subsequent `connect()` calls.

```typescript
import {BrowserTabIPC, TransportType} from '@lopatnov/browser-tab-ipc';

// Default — auto-selects from all three transports
const ipc = new BrowserTabIPC();

// Force a single transport
const ipc = new BrowserTabIPC({
  transportTypes: TransportType.broadcastChannel,
});

// Custom fallback chain
const ipc = new BrowserTabIPC({
  transportTypes: [TransportType.sharedWorker, TransportType.sessionStorage],
  sharedWorkerUri: '/ipc-worker.js',
});
```

#### `connect(options?: ConnectionOptions): Promise<ConnectionState>`

Establishes the connection. Options passed here are merged with constructor options.

```typescript
const state = await ipc.connect({
  sharedWorkerUri: '/dist/ipc-worker.js',
  storageKey: 'my-app-channel',
  storageExpiredTime: 30_000,
});

console.log(state.connected); // true
console.log(state.type); // e.g. TransportType.broadcastChannel
```

#### `disconnect(): Promise<ConnectionState>`

Closes the active connection and cleans up all listeners and timers.

```typescript
const state = await ipc.disconnect();
console.log(state.connected); // false
```

#### `postMessage(message: any): Promise<void>`

Broadcasts a serializable value to all connected tabs.

```typescript
await ipc.postMessage('ping');
await ipc.postMessage({type: 'STORE_UPDATE', payload: {count: 42}});
```

#### Event subscription methods

| Method                      | Trigger                                 |
| --------------------------- | --------------------------------------- |
| `message(callback)`         | A message was received from another tab |
| `connected(callback)`       | Connection established successfully     |
| `connectionError(callback)` | Connection attempt failed               |
| `disconnected(callback)`    | Connection was closed                   |

```typescript
ipc.message((data) => console.log('Message:', data));
ipc.connected((state) => console.log('Connected via', TransportType[state.type!]));
ipc.connectionError((state) => console.error('Connection failed:', state.error));
ipc.disconnected(() => console.log('Disconnected'));
```

You can also use the `EventEmitter` API directly with the exported event name constants:

```typescript
import {EventMessage, EventConnected, EventConnectionError, EventDisconnected} from '@lopatnov/browser-tab-ipc';

ipc.on(EventMessage, (data) => {
  /* ... */
});
ipc.once(EventConnected, (state) => {
  /* ... */
});
```

---

### ConnectionOptions

| Option               | Type                               | Default                 | Description                                     |
| -------------------- | ---------------------------------- | ----------------------- | ----------------------------------------------- |
| `transportTypes`     | `TransportType \| TransportType[]` | All three, in order     | Transport(s) to try, left to right              |
| `sharedWorkerUri`    | `string`                           | GitHub CDN fallback URL | URL to `ipc-worker.js` (SharedWorker transport) |
| `storageKey`         | `string`                           | `'ipc'`                 | Namespace prefix for SessionStorage keys        |
| `storageExpiredTime` | `number`                           | `30000`                 | Message TTL in milliseconds (SessionStorage)    |

---

### ConnectionState

Returned by `connect()` and `disconnect()`, and passed to event callbacks.

| Field       | Type                    | Description                                   |
| ----------- | ----------------------- | --------------------------------------------- |
| `type`      | `TransportType \| null` | Active transport, or `null` if none connected |
| `connected` | `boolean`               | Whether the connection is currently active    |
| `error?`    | `unknown`               | Error detail when a connection attempt fails  |

---

### TransportType

```typescript
import {TransportType} from '@lopatnov/browser-tab-ipc';

TransportType.broadcastChannel; // BroadcastChannel API
TransportType.sharedWorker; // SharedWorker
TransportType.sessionStorage; // SessionStorage events
```

---

### Events

| Constant               | When emitted                       |
| ---------------------- | ---------------------------------- |
| `EventConnected`       | A transport connected successfully |
| `EventConnectionError` | A transport failed to connect      |
| `EventDisconnected`    | The connection was closed          |
| `EventMessage`         | A message arrived from another tab |

---

## SharedWorker Setup

The SharedWorker transport requires a worker script served from **your own origin** to avoid CORS issues. Copy the bundled file into your project:

```shell
cp node_modules/@lopatnov/browser-tab-ipc/dist/ipc-worker.js public/
```

Then point `connect()` to it:

```typescript
await ipc.connect({sharedWorkerUri: '/ipc-worker.js'});
```

> Without this step, the library falls back to a GitHub-hosted worker — which only works on the same origin as the CDN.

---

## Troubleshooting

**`Module '"events"' can only be default-imported using the 'allowSyntheticDefaultImports' flag`**

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true
  }
}
```

**Messages are not received in other tabs**

- All tabs must be on the **same origin** (protocol + host + port).
- BroadcastChannel and SessionStorage are strictly same-origin.
- SharedWorker can bridge origins if the worker file is served from the target origin.

**SharedWorker fails silently**

- Open **DevTools → Application → Shared Workers** and check for errors.
- Verify the `sharedWorkerUri` path is accessible from the browser (check for 404).
- If the file is missing, copy `ipc-worker.js` to your `public/` folder as shown above.

**Connection established but no messages arrive**

- Both tabs must call `connect()` before any messages are sent.
- A tab does **not** receive its own messages — only other tabs do.

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

- Bug reports → [open an issue](https://github.com/lopatnov/browser-tab-ipc/issues)
- Security vulnerabilities → [GitHub Security Advisories](https://github.com/lopatnov/browser-tab-ipc/security/advisories/new) _(do not use public issues)_
- Questions → [Discussions](https://github.com/lopatnov/browser-tab-ipc/discussions)
- Found it useful? A [star on GitHub](https://github.com/lopatnov/browser-tab-ipc) helps others discover the project

---

## Built With

- [TypeScript](https://www.typescriptlang.org/) — strict typing throughout
- [Rollup](https://rollupjs.org/) — bundled to ESM, CJS, and UMD formats
- [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) — primary transport
- [SharedWorker API](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) — cross-tab shared execution context
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) — universal fallback transport
- [Node.js EventEmitter](https://nodejs.org/api/events.html) — event-driven API
- [Yarn](https://yarnpkg.com/) — package management and script runner
- [Babel](https://babeljs.io/) — TypeScript transpilation pipeline for tests
- [Puppeteer](https://pptr.dev/) + [Jest](https://jestjs.io/) — cross-tab integration testing in a real browser

---

## License

[Apache-2.0](LICENSE) © 2019–2026 [Oleksandr Lopatnov](https://github.com/lopatnov) · [LinkedIn](https://www.linkedin.com/in/lopatnov/)

[eventemitter]: https://nodejs.org/api/events.html
[browsertabipc]: ./src/browser-tab-ipc.ts
[transporttype]: ./src/transport-type.enum.ts
[connectionoptions]: ./src/connection-options.ts
[connectionstate]: ./src/connection-state.ts
