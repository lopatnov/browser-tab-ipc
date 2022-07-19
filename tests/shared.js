(function (self) {
  const ports = new Set();
  self.onconnect = function (e) {
    if ((e === null || e === void 0 ? void 0 : e.source) && e.source instanceof MessagePort) {
      const port = e.source;
      ports.add(port);
      port.addEventListener(
        'message',
        function (ev) {
          const message = ev.data;
          ports.forEach(function (p) {
            if (p !== port) {
              p.postMessage(message);
            }
          });
        },
        false,
      );
      port.start();
    }
  };
})(self);
