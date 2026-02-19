(function (self: SharedWorkerGlobalScope) {
  const ports = new Set<MessagePort>();
  self.onconnect = (e) => {
    if (e?.source && e.source instanceof MessagePort) {
      const port = e.source;
      ports.add(port);
      port.onmessage = (ev: MessageEvent) => {
        const data = ev.data;
        const cmd = data?.cmd;
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
})(self as any);

export {};
