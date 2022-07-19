(function (self: SharedWorkerGlobalScope) {
  const ports = new Set<MessagePort>();
  self.onconnect = (e) => {
    if (e?.source && e.source instanceof MessagePort) {
      const port = e.source;
      ports.add(port);
      port.addEventListener(
        'message',
        (ev: any) => {
          const message = ev.data;
          ports.forEach((p) => {
            if (p !== port) {
              p.postMessage(message);
            }
          });
        },
        false,
      );
      port.addEventListener(
        'messageerror',
        (ev: any) => {
          console.error(ev);
        },
        false,
      );
      (port as any).start();
    }
  };

  self.onerror = (e) => {
    console.error(e);
  };
})(self as any);
