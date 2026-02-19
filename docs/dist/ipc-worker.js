(function () {
  'use strict';

  (function (self) {
      const ports = new Set();
      self.onconnect = (e) => {
          if ((e === null || e === void 0 ? void 0 : e.source) && e.source instanceof MessagePort) {
              const port = e.source;
              ports.add(port);
              port.onmessage = (ev) => {
                  const data = ev.data;
                  const cmd = data === null || data === void 0 ? void 0 : data.cmd;
                  switch (cmd) {
                      case 'x':
                          ports.delete(port);
                          break;
                      default:
                          ports.forEach((p) => {
                              if (p !== port) {
                                  p.postMessage(data);
                              }
                          });
                  }
              };
              port.start();
          }
      };
      self.onerror = (e) => {
          console.error(e);
      };
  })(self);

})();
//# sourceMappingURL=ipc-worker.js.map
