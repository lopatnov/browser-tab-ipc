# @lopatnov/browser-tab-ipc [![Twitter][twitterbage]][twitter] [![LinkedIn][linkedinbage]][linkedin]

[![npm](https://img.shields.io/npm/dt/@lopatnov/browser-tab-ipc)](https://www.npmjs.com/package/@lopatnov/browser-tab-ipc)
[![NPM version](https://badge.fury.io/js/%40lopatnov%2Fbrowser-tab-ipc.svg)](https://www.npmjs.com/package/@lopatnov/browser-tab-ipc)
[![License](https://img.shields.io/github/license/lopatnov/browser-tab-ipc)](https://github.com/lopatnov/browser-tab-ipc/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/lopatnov/browser-tab-ipc)](https://github.com/lopatnov/browser-tab-ipc/issues)
[![GitHub forks](https://img.shields.io/github/forks/lopatnov/browser-tab-ipc)](https://github.com/lopatnov/browser-tab-ipc/network)
[![GitHub stars](https://img.shields.io/github/stars/lopatnov/browser-tab-ipc)](https://github.com/lopatnov/browser-tab-ipc/stargazers)
![GitHub top language](https://img.shields.io/github/languages/top/lopatnov/browser-tab-ipc)

[![Build and Test package](https://github.com/lopatnov/browser-tab-ipc/actions/workflows/build-and-test-package.yml/badge.svg)](https://github.com/lopatnov/browser-tab-ipc/tree/master/tests)
[![Publish NPM package](https://github.com/lopatnov/browser-tab-ipc/actions/workflows/npm-publish-package.yml/badge.svg)](https://github.com/lopatnov/browser-tab-ipc/releases)
[![Dependencies](https://img.shields.io/librariesio/release/npm/@lopatnov/browser-tab-ipc)](https://www.npmjs.com/package/@lopatnov/browser-tab-ipc?activeTab=dependencies)

With this client technology, you can exchange messages between browser tabs. This is a bus network among browser tabs, inter-process communication mechanism between browser tabs. This technology allows to create a chat between browser tabs. It allows create features to optimize the performance of high-demand applications, decrease amount of http requests or socket connections. It also allows synchronize changes in different browser tabs.

This technology supports two transport type connections. The messages can be transferred through a storage or through a JavaScript worker. Transport technology can be chosen automatically.

## Install

[![https://nodei.co/npm/@lopatnov/browser-tab-ipc.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/@lopatnov/browser-tab-ipc.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/@lopatnov/browser-tab-ipc)

```shell
npm install @lopatnov/browser-tab-ipc
```

[Browser](//lopatnov.github.io/browser-tab-ipc/dist/library.js)

```html
<script src="https://lopatnov.github.io/browser-tab-ipc/dist/library.min.js"></script>

<!-- Example: how to use in browser -->
<script>
  //...
  var BrowserTabIPC = browserTabIpc.BrowserTabIPC;
  ipc = new BrowserTabIPC();
  ipc.message(function (message) {
    console.log(message);
  });
  ipc
    .connect({
      sharedWorkerUri: '//lopatnov.github.io/browser-tab-ipc/dist/ipc-worker.js', // Please copy this file `dist/ipc-worker.js` to your project and replace this url
    })
    .then(function (state) {
      console.log(state);
    });
  var id = Math.trunc(Math.random() * 10000);
  setInterval(() => {
    ipc.postMessage('Hello browser Tab! I am page with ID: ' + id);
  }, 200);
  //...
</script>
```

## Post Install

Copy [~/node_modules/@lopatnov/browser-tab-ipc/dist/ipc-worker.js](./dist/ipc-worker.js) file to your project to use Worker transport technology and avoid CORS issues. Provide the path to this file for Worker transport connection.

## Import package to the project

### TypeScript

```typescript
import {BrowserTabIPC, TransportType, ConnectionState} from '@lopatnov/browser-tab-ipc';
```

### JavaScript

```javascript
var library = require('@lopatnov/browser-tab-ipc');
var BrowserTabIPC = library.BrowserTabIPC;
var TransportType = library.TransportType;
var ConnectionState = library.ConnectionState;
```

## API

### class [BrowserTabIPC][browsertabipc]

Provides methods to connect/disconnect ipc technology using one of some possible transports and send a message through it.

This class extends from [EventEmitter][eventemitter] class and can use `EventConnected`, `EventConnectionError`, `EventDisconnected`, `EventMessage` events, however it's not obligatory.

```ts
import {EventConnected, EventConnectionError, EventDisconnected, EventMessage} from '@lopatnov/browser-tab-ipc';

ipc.on(EventConnected, (state) => {
  console.log('connected', state);
});
```

#### constructor(options?: [ConnectionOptions][connectionoptions])

Creates an instance of [BrowserTabIPC][browsertabipc] class.

- **options?: [ConnectionOptions][connectionoptions]** Optional parameter `options` provides connection options to create a new instance.

```ts
const ipc = new BrowserTabIPC({
  transportTypes: [TransportType.sharedWorker, TransportType.sessionStorage],
});
```

#### connect(options?: [ConnectionOptions][connectionoptions]): Promise<[ConnectionState][connectionstate]>

Connects [BrowserTabIPC][browsertabipc] instance to a bus network among browser tabs using one of possible transport provided in constructor.

- **options?: [ConnectionOptions][connectionoptions]** Optional parameter `options` extends connection options to IPC instance.
  - **transportTypes?: [TransportType][transporttype] | [TransportType][transporttype][];** An enum value or array of enum [TransportType][transporttype]. That's possible transports that IPC technology can use.
  - **sharedWorkerUri?: string;** Worker transport option. A link to IPC worker.
  - **storageKey?: string;** Storage transport option. A key, that IPC technology uses in local storage to identify IPC messages
  - **storageExpiredTime?: number;** Storage transport option. Timeout constant that technology uses to remove old messages

**returns Promise<[ConnectionState][connectionstate]>** a state of connection.

- **type: [TransportType][transporttype] | null;** Used transport type
- **connected: boolean;** Is connected?
- **error?: any;** An error

[BrowserTabIPC][browsertabipc] also have `defaultWorkerUri` static variable, that uses when `sharedWorkerUri` option wasn't provided.

```ts
const state = await ipc.connect({
  sharedWorkerUri: '//lopatnov.github.io/browser-tab-ipc/dist/ipc-worker.js',
  storageKey: 'ipc',
  storageExpiredTime: 30000,
});
```

#### disconnect(): Promise<[ConnectionState][connectionstate]>

Disconnects [BrowserTabIPC][browsertabipc] instance.

**returns Promise<[ConnectionState][connectionstate]>** a state of connection.

```ts
ipc.disconnect();
```

#### postMessage(message: `any`): Promise<`void`>

Sends a message of any serializable type.

```ts
ipc.postMessage('Hello browser Tab!');
```

#### connected(callback: [Action1][action1]<[ConnectionState][connectionstate]>)

Adds a callback to `EventConnected` event.

```ts
ipc.connected(function (connectionState) {
  console.log('Connected. Current connection state is ', connectionState);
});
```

#### connectionError(callback: [Action1][action1]<[ConnectionState][connectionstate]>)

Adds a callback to `EventConnectionError` event.

```ts
ipc.connectionError(function (connectionState) {
  console.log('Connection error. Current connection state is ', connectionState);
});
```

#### disconnected(callback: [Action1][action1]<[ConnectionState][connectionstate]>)

Adds a callback to `EventDisconnected` event.

```ts
ipc.disconnected(function (connectionState) {
  console.log('Disconnected. Current connection state is ', connectionState);
});
```

#### message(callback: [Action1][action1]<`any`>)

Adds a callback to `EventMessage` event.

```ts
ipc.message(function (message) {
  console.log('Received a message: ', message);
});
```

## Troubleshooting

> Module '"events"' can only be default-imported using the 'allowSyntheticDefaultImports' flag

Edit `tsconfig.json`, set "allowSyntheticDefaultImports": true,

## Donate

[![Charity Health][charity_health]][dobro]
[![Charity Social][charity_social]][redcross]
[![Charity Army][charity_army]][peoplesproject]

I am Computer Software Engineer, individual entrepreneur. I develop software of various complexity for the web, desktop, mobile and embedded devices. I have expertise in web development using .NET, Angular and React frameworks, Microsoft and Google technologies, working with the North American and European markets through reseller companies by B2B business model. I was a part of development teams and worked independently with enterprise projects, digital technologies, fintech projects, real estate, barcode software and petroleum industry. I would like to note that I have not bad analytical skills. I'm improving my skills continuously and I have recommendations.

Open source software is just a hobby. I am making it just for fun. A small amount of help will be more significant for charitable foundations. I propose to pay attention to the various local funds in my country. I hope this will make someone's life better.

## Rights and Agreements [![LinkedIn][linkedinbage]][linkedin]

License [Apache-2.0](https://github.com/lopatnov/browser-tab-ipc/blob/master/LICENSE)

Copyright 2022 Oleksandr Lopatnov

[charity_health]: https://img.shields.io/badge/Charity-Health-red?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABBVBMVEUAAAAAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWT///+PPo6DAAAAVXRSTlMAAA4wOR0CAUe/7vPbfA9K5PyKBAPF9PL47f7qN2QiW0V+mpvejJWBnaBanDWLpUva3aGemaa7o1d7rY2nXt/G/eszLmoUZ4mAT+ePBU3D3IIREDEe6n6MQgAAAAFiS0dEVgoN6YkAAAAHdElNRQfkCAcPCB1MJSGgAAAAlElEQVQY02NgIB0wMjIxs7CyMcIF2Dk4ubh5ePngIvwCoUAgKCTMyMjOyCbCziAqJi4hKSUlLSMrJ6+gqKTMoKKqqqauoaGppa2jq6epb8BgqGFkbGJqZm6hZmllbWNrx2AfKuXgIBXq6OSs6uLq5u7B4OkFMtTB24cRCEC2sPn6cXH7BwQyIhwWFMwSIsJIkm9QAQBayRNRV4rFmQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wOC0wN1QxNTowODoyOSswMjowMBaHG7YAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDgtMDdUMTU6MDg6MjkrMDI6MDBn2qMKAAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC
[charity_social]: https://img.shields.io/badge/Charity-Social-orange?style=flat-square&logo=data:image/png;base64,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
[charity_army]: https://img.shields.io/badge/Charity-Army-yellowgreen?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEsGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMTYiCiAgIHRpZmY6SW1hZ2VXaWR0aD0iMTYiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249Ijk2LzEiCiAgIHRpZmY6WVJlc29sdXRpb249Ijk2LzEiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIxNiIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjE2IgogICBleGlmOkNvbG9yU3BhY2U9IjEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjItMDctMjVUMTY6Mzg6NTArMDM6MDAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDctMjVUMTY6Mzg6NTArMDM6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMS4xMC41IgogICAgICBzdEV2dDp3aGVuPSIyMDIyLTA3LTI1VDE2OjM4OjUwKzAzOjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InIiPz7sv92nAAABgWlDQ1BzUkdCIElFQzYxOTY2LTIuMQAAKJF1kc8rRFEUxz9maMSIYkFZvMSshvyoiY3FyK/CYuYpvzYzz5sZNT9e780k2SrbKUps/FrwF7BV1koRKVnKmtig5zxPjWTO7dzzud97z+nec8GjprWMVdkNmWzejIyGlZnZOcX3iI8W6uggENMsYzI6olLW3m6ocOJVp1Or/Ll/rXZRtzSoqBYe1AwzLzwmPLGcNxzeFG7SUrFF4WPhoCkXFL529LjLTw4nXf5w2FQjQ+BpEFaSvzj+i7WUmRGWl9OeSRe0n/s4L/Hr2emoxDbxViwijBJGYZxhhgjRw4DMITrppUtWlMnv/s6fIie5mswGK5gskSRFnqCoBamuS0yIrstIs+L0/29frURfr1vdH4aqB9t+6QDfBnwWbft937Y/D8B7D2fZUn5uD/pfRS+WtPZdqF+Dk/OSFt+C03VovjNiZuxb8op7Egl4PoK6WWi8hJp5t2c/+xzegroqX3UB2zsQkPP1C1+cH2f+2Px+sgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADFJREFUOI1jYBhowMjAwMDA0PD/P1m6GxgZmSh1wagB0Fj4dH8eWbHAp5g0GgvDAwAAkG4HFaxv5FUAAAAASUVORK5CYII=
[dobro]: https://dobro.ua/en/projects/category/zdorovia?page=1&category=zdorovia&tag=28
[redcross]: https://redcross.org.ua/en/donate/
[peoplesproject]: https://www.peoplesproject.com/en/
[linkedinbage]: https://img.shields.io/badge/LinkedIn-lopatnov-informational?style=social&logo=linkedin
[linkedin]: https://www.linkedin.com/in/lopatnov/
[twitterbage]: https://img.shields.io/twitter/url?url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fbrowser-tab-ipc
[twitter]: https://twitter.com/intent/tweet?text=I%20want%20to%20share%20TypeScript%20library:&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fbrowser-tab-ipc
[eventemitter]: https://nodejs.org/dist/v11.13.0/docs/api/events.html
[browsertabipc]: ./src/browser-tab-ipc.ts
[transporttype]: ./src/transport-type.enum.ts
[connectionoptions]: ./src/connection-options.ts
[connectionstate]: ./src/connection-state.ts
[action1]: ./src/functors.ts
