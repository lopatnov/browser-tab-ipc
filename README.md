# @lopatnov/browser-tab-ipc [![Twitter](https://img.shields.io/twitter/url?url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fbrowser-tab-ipc)](https://twitter.com/intent/tweet?text=I%20want%20to%20share%20TypeScript%20library:&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fbrowser-tab-ipc) [![LinkedIn](https://img.shields.io/badge/LinkedIn-lopatnov-informational?style=social&logo=linkedin)](https://www.linkedin.com/in/lopatnov/)

[![npm](https://img.shields.io/npm/dt/@lopatnov/browser-tab-ipc)](https://www.npmjs.com/package/@lopatnov/browser-tab-ipc)
[![NPM version](https://badge.fury.io/js/%40lopatnov%2Fbrowser-tab-ipc.svg)](https://www.npmjs.com/package/@lopatnov/browser-tab-ipc)
[![License](https://img.shields.io/github/license/lopatnov/browser-tab-ipc)](https://github.com/lopatnov/browser-tab-ipc/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/lopatnov/browser-tab-ipc)](https://github.com/lopatnov/browser-tab-ipc/issues)
[![GitHub forks](https://img.shields.io/github/forks/lopatnov/browser-tab-ipc)](https://github.com/lopatnov/browser-tab-ipc/network)
[![GitHub stars](https://img.shields.io/github/stars/lopatnov/browser-tab-ipc)](https://github.com/lopatnov/browser-tab-ipc/stargazers)
![GitHub top language](https://img.shields.io/github/languages/top/lopatnov/browser-tab-ipc)

[![Build and Test package](https://github.com/lopatnov/browser-tab-ipc/actions/workflows/build-and-test-package.yml/badge.svg)](https://github.com/lopatnov/browser-tab-ipc/tree/master/tests)
[![Publish NPM package](https://github.com/lopatnov/browser-tab-ipc/actions/workflows/npm-publish-package.yml/badge.svg)](https://github.com/lopatnov/browser-tab-ipc/releases)
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/@lopatnov/browser-tab-ipc)](https://www.npmjs.com/package/@lopatnov/browser-tab-ipc?activeTab=dependencies)

With this technology, you can exchange messages between browser tabs. This is a bus network among browser tabs, inter-process communication mechanism between browser tabs. This technology allows to create a chat between browser tabs. It allows to optimize the performance of high-demand applications, decrease amount of http requests or socket connections.

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
  ipc = new browserTabIpc.BrowserTabIPC();
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

## Import package to the project

### TypeScript

```typescript
import {BrowserTabIPC} from '@lopatnov/browser-tab-ipc';
```

### JavaScript

```javascript
var library = require('@lopatnov/browser-tab-ipc');
var BrowserTabIPC = library.BrowserTabIPC;
```

## How to use

```ts
import {BrowserTabIPC} from './../src/browser-tab-ipc';

const tabID = Math.trunc(Math.random() * 10000);
const ipc = new BrowserTabIPC();

ipc.message(function (message) {
  console.log(message);
});
const state = await ipc.connect({
  sharedWorkerUri: '//lopatnov.github.io/browser-tab-ipc/dist/ipc-worker.js', // Please copy this file `dist/ipc-worker.js` to your project and replace this url
});
console.log(state);

setInterval(() => {
  ipc.postMessage('Hello browser Tab! I am page with ID: ' + tabID);
}, 200);
```

## Rights and Agreements

License [Apache-2.0](https://github.com/lopatnov/browser-tab-ipc/blob/master/LICENSE)

Copyright 2022 Oleksandr Lopatnov
