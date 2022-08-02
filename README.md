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
[![LinkedIn Volunteer][prykhodkobage]][prykhodko]

Open source software is just a hobby. I am making it just for fun. A small amount of help will be more significant for charitable foundations. I propose to pay attention to the various local funds or to the volunteers in my country. I hope this will make someone's life better.

## Rights and Agreements [![LinkedIn][linkedinbage]][linkedin]

Contact me in LinkedIn, I will consider profitable business offers. I am Computer Software Engineer, individual entrepreneur. I develop software of various complexity for the web, desktop, mobile and embedded devices. I have expertise in web development using .NET, Angular and React frameworks, Microsoft and Google technologies, working with the North American and European markets through reseller companies by B2B business model. I was a part of development teams and worked independently with enterprise projects, digital technologies, fintech projects, real estate, barcode software and petroleum industry. I would like to note that I have not bad analytical skills. I'm improving my skills continuously and I have recommendations.

License [Apache-2.0](https://github.com/lopatnov/browser-tab-ipc/blob/master/LICENSE)

Copyright 2022 Oleksandr Lopatnov

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
[prykhodkobage]: https://img.shields.io/badge/Eco%20Activist-Artyom%20Prykhodko-informational?style=flat-square&logo=linkedin
[prykhodko]: https://www.linkedin.com/in/artyom-prykhodko-998708125/
[dobro]: https://dobro.ua/en/projects/category/zdorovia?page=1&category=zdorovia&tag=28
[charity_health]: https://img.shields.io/badge/Charity%20Health-Dobro-red?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABBVBMVEUAAAAAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWQAuWT///+PPo6DAAAAVXRSTlMAAA4wOR0CAUe/7vPbfA9K5PyKBAPF9PL47f7qN2QiW0V+mpvejJWBnaBanDWLpUva3aGemaa7o1d7rY2nXt/G/eszLmoUZ4mAT+ePBU3D3IIREDEe6n6MQgAAAAFiS0dEVgoN6YkAAAAHdElNRQfkCAcPCB1MJSGgAAAAlElEQVQY02NgIB0wMjIxs7CyMcIF2Dk4ubh5ePngIvwCoUAgKCTMyMjOyCbCziAqJi4hKSUlLSMrJ6+gqKTMoKKqqqauoaGppa2jq6epb8BgqGFkbGJqZm6hZmllbWNrx2AfKuXgIBXq6OSs6uLq5u7B4OkFMtTB24cRCEC2sPn6cXH7BwQyIhwWFMwSIsJIkm9QAQBayRNRV4rFmQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wOC0wN1QxNTowODoyOSswMjowMBaHG7YAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDgtMDdUMTU6MDg6MjkrMDI6MDBn2qMKAAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC
