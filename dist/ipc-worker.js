'use strict';

(function (self) {
    var ports = new Set();
    self.onconnect = function (e) {
        if ((e === null || e === void 0 ? void 0 : e.source) && e.source instanceof MessagePort) {
            var port_1 = e.source;
            ports.add(port_1);
            port_1.addEventListener('message', function (ev) {
                var data = ev.data;
                var cmd = data === null || data === void 0 ? void 0 : data.cmd;
                switch (cmd) {
                    case 'x':
                        ports.delete(port_1);
                        break;
                    default:
                        ports.forEach(function (p) {
                            if (p !== port_1) {
                                p.postMessage(data);
                            }
                        });
                }
            }, false);
            port_1.start();
        }
    };
    self.onerror = function (e) {
        console.error(e);
    };
})(self);
//# sourceMappingURL=ipc-worker.js.map
